import type { Candidate, Voter } from "../blockchain/data_types";
import CryptoBlockchain from "../crypto/cryptoBlockchain";
import {
  clearCandidates,
  clearCandidatesTemp,
  clearCitizens,
  clearUsers,
  clearVotersGenerated,
  readAnnouncement,
  readCandidatesTemp,
  readCitizen,
  readCitizens,
  readUser,
  readUsers,
  readVoterGenerated,
  removeCitizen,
  removeUser,
  writeAnnouncement,
  writeCandidateTemp,
  writeCitizen,
  writeUser,
  writeVoterGenerated,
} from "../leveldb";
import {
  type Announcement,
  type Citizen,
  type Otp,
  Role,
  type User,
} from "./data_types";

const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const CryptoBlockIdentifier = new CryptoBlockchain(
  process.env.SECRET_KEY_IDENTIFIER,
  process.env.SECRET_IV_IDENTIFIER,
);

class Committee {
  citizens: Citizen[];
  users: User[];
  candidates: Candidate[];
  votersGenerated: Voter[];
  announcement!: Announcement;

  constructor() {
    this.citizens = [];
    this.candidates = [];
    this.votersGenerated = [];
    this.users = [];
    this.loadCitizens();
    this.loadUsers();
  }

  public async loadCitizens() {
    try {
      this.citizens = await readCitizens();
    } catch (_error: any) {}
  }

  public async loadUsers() {
    try {
      this.users = await readUsers();
    } catch (_error: any) {}
  }

  public async generateIdentifiers() {
    const voters: Voter[] = [];

    try {
      await clearVotersGenerated();

      const length = 8;
      for (const citizen of this.citizens) {
        if (citizen.status === "verified") {
          const id = CryptoBlockIdentifier.generateIdentifier(length);
          const electoralIdEncrypted = CryptoBlockIdentifier.encryptData(
            citizen.electoralId,
          );
          const obj: Voter = {
            identifier: id,
            IV: electoralIdEncrypted.IV,
            electoralId: electoralIdEncrypted.CIPHER_TEXT,
            choiceCode: "not set yet",
            state: false,
            secret: "not set yet",
          };

          voters.push(obj);
          await writeVoterGenerated(id, obj);
        }
      }

      this.votersGenerated = voters;
      return voters;
    } catch (_e: any) {}

    return [];
  }

  public async clearCandidates() {
    try {
      await clearCandidatesTemp();
      await clearCandidates();
      this.candidates = [];
      return this.candidates;
    } catch (_e: any) {}

    return [];
  }

  public async addCandidateCommittee(
    name: string,
    code: number,
    party: string,
    acronym?: string,
    status?: string,
  ) {
    try {
      const obj: Candidate = {
        name: name,
        num_votes: 0,
        code: code,
        acronym: acronym,
        party: party,
        status: status,
      };

      await writeCandidateTemp(code.toString(), obj);
      this.candidates = await readCandidatesTemp();
    } catch (_e: any) {}

    return this.candidates;
  }

  public async authMobile(electoralId: string, password: string) {
    try {
      const response = await readCitizen(electoralId);
      if (!response) return null;

      const match = await bcrypt.compare(password, response.password);

      if (match) {
        return {
          electoralId: response.electoralId,
          address: response.address,
          email: response.email,
          province: response.province,
        };
      }
    } catch (_error: any) {}

    return null;
  }

  public async authWeb(username: string, password: string) {
    try {
      const response = await readUser(username);
      if (!response) return null;

      const match = await bcrypt.compare(password, response.password);

      if (match) {
        return {
          name: response.name,
          username: response.username,
          role: response.role,
        };
      }
    } catch (_error: any) {}
    return null;
  }

  public async eraseCitzens() {
    try {
      await clearCitizens();
      await this.loadCitizens();
    } catch (_error: any) {}
  }

  public async eraseUsers() {
    try {
      await clearUsers();
      await this.loadUsers();
    } catch (_error: any) {}

    return this.users;
  }

  public async eraseUser(key: string) {
    try {
      await removeUser(key);
      await this.loadUsers();
    } catch (_error: any) {}

    return this.users;
  }

  public async eraseRegister(key: string) {
    try {
      await removeCitizen(key);
      await this.loadCitizens();
    } catch (_error: any) {}

    return this.citizens;
  }

  private async saveCitizen(citizen: Citizen) {
    try {
      await writeCitizen(citizen.electoralId, citizen);
    } catch (_e: any) {}
  }

  private async saveUser(user: User) {
    try {
      await writeUser(user.username, user);
    } catch (_e: any) {}
  }

  public async updateTokenCitzen(electoralId: string, refreshToken: string) {
    const citizen = this.citizens.find(
      (x) => x.electoralId.localeCompare(electoralId) === 0,
    );

    if (!citizen) return;

    citizen.refreshToken = refreshToken;

    try {
      await this.saveCitizen(citizen);
    } catch (_e: any) {}

    const tmp = this.citizens.filter(
      (x) => x.electoralId.localeCompare(citizen.electoralId) !== 0,
    );
    this.citizens = [...tmp, citizen];
  }

  public async updateTokenUser(username: string, refreshToken: string) {
    const user = this.users.find(
      (x) => x.username.localeCompare(username) === 0,
    );

    if (!user) return;

    user.refreshToken = refreshToken;

    try {
      await this.saveUser(user);
    } catch (_e: any) {}

    const tmp = this.users.filter(
      (x) => x.username.localeCompare(user.username) !== 0,
    );
    this.users = [...tmp, user];
  }

  public async addCitzen(data: any) {
    const count = this.citizens.filter((x) => x.email === data.email).length;
    if (count > 0) return false;

    const hashedPwd = await bcrypt.hash(data.password, 10);

    const citizen: Citizen = {
      electoralId: data.electoralId,
      name: data.name,
      email: data.email,
      address: data.address,
      province: data.province,
      password: hashedPwd,
      status: "pending",
      verification: "0000000000",
      refreshToken: "",
      otp: this.generateOtp(),
    };

    if (this.existsCitizen(citizen)) {
      return false;
    }

    this.citizens.push(citizen);
    await this.saveCitizen(citizen);

    return true;
  }

  public async updateCitizen(data: any) {
    try {
      await this.loadCitizens();
      const oldCitizen = this.citizens.find(
        (x) => x.electoralId === data.electoralId,
      );

      if (oldCitizen) {
        Object.assign(oldCitizen, {
          name: data.name,
          email: data.email,
          address: data.address,
          province: data.province,
          status: data.status,
        });

        await this.saveCitizen(oldCitizen);
        return true;
      }
    } catch (_e: any) {}

    return false;
  }

  public async updateUser(data: any) {
    try {
      await this.loadUsers();
      const oldUser = this.users.find((x) => x.username === data.username);

      if (oldUser) {
        const updatedFields: Partial<User> = {
          name: data.name,
          role: data.role === "admin" ? Role.ADMIN : Role.NORMAL,
        };

        if (data.password) {
          updatedFields.password = await bcrypt.hash(data.password, 10);
        }

        Object.assign(oldUser, updatedFields);

        await this.saveUser(oldUser);
        return true;
      }
    } catch (_e: any) {}

    return false;
  }

  public async addUser(data: any) {
    const hashedPwd = await bcrypt.hash(data.password, 10);

    const user: User = {
      name: data.name,
      username: data.username,
      password: hashedPwd,
      role: data.role === "admin" ? Role.ADMIN : Role.NORMAL,
      refreshToken: "",
      timestamp: Date.now(),
    };

    if (this.existsUser(user)) {
      return null;
    }

    await this.saveUser(user);
    this.users.push(user);

    return this.users;
  }

  public async deployAnnouncement(data: any) {
    const announcement: Announcement = {
      startTimeVoting: data.startTimeVoting,
      endTimeVoting: data.endTimeVoting,
      dateResults: data.dateResults,
      numOfCandidates: parseInt(data.numOfCandidates, 10),
      numOfVoters: parseInt(data.numOfVoters, 10),
      dateCreated: Date.now(),
    };

    try {
      await writeAnnouncement(announcement);
      this.announcement = announcement;
      return this.announcement;
    } catch (_e: any) {}

    return null;
  }

  public async getAnnouncement() {
    try {
      this.announcement = await readAnnouncement();
    } catch (_error: any) {}

    return this.announcement;
  }

  private existsCitizen(citizen: Citizen): boolean {
    return (
      this.citizens.findIndex((x) => x.electoralId === citizen.electoralId) !==
      -1
    );
  }

  private existsUser(user: User): boolean {
    return this.users.findIndex((x) => x.username === user.username) !== -1;
  }

  public getRefreshTokens(): string[] {
    return this.citizens.map((x) => x.refreshToken);
  }

  private generateOtp(): Otp {
    const secret = speakeasy.generateSecret({
      name: "Election QuantumBallot",
      length: 20,
      step: 300,
    });

    const otp: Otp = {
      ascii: secret.ascii,
      hex: secret.hex,
      base32: secret.base32,
      otpauth_url: secret.otpauth_url,
    };

    return otp;
  }

  public verifyOtp(secret: string, token: string): boolean {
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
      window: 1,
    });

    return verified;
  }

  public generateQRCode = async (
    otpauth_url: string,
  ): Promise<string | null> => {
    try {
      const qrCodeData = await new Promise<string>((resolve, reject) => {
        qrcode.toDataURL(otpauth_url, (err: any, data: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      return qrCodeData;
    } catch (_error: any) {
      return null;
    }
  };

  public getCitizens() {
    return this.citizens;
  }

  public async getVotersGenerated() {
    try {
      this.votersGenerated = await readVoterGenerated();
    } catch (_error: any) {}

    return this.votersGenerated;
  }

  public async getCandidates() {
    try {
      this.candidates = await readCandidatesTemp();
    } catch (_error: any) {}

    return this.candidates;
  }

  public getUsers() {
    return this.users;
  }
}

export default Committee;
