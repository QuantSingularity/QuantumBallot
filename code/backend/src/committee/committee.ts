import type { Candidate, Voter } from "../../../blockchain/src/core/data_types";
import CryptoBlockchain from "../../../blockchain/src/crypto/cryptoBlockchain";
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
} from "../../../blockchain/src/leveldb";
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

let _CryptoBlockIdentifier: CryptoBlockchain | null = null;
const getCryptoBlockIdentifier = () => {
  if (!_CryptoBlockIdentifier) {
    _CryptoBlockIdentifier = new CryptoBlockchain(
      process.env.SECRET_KEY_IDENTIFIER,
      process.env.SECRET_IV_IDENTIFIER,
    );
  }
  return _CryptoBlockIdentifier;
};

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
    } catch (e: unknown) {
      console.error("Error loading citizens:", e);
    }
  }

  public async loadUsers() {
    try {
      this.users = await readUsers();
    } catch (e: unknown) {
      console.error("Error loading users:", e);
    }
  }

  public async generateIdentifiers() {
    const voters: Voter[] = [];
    try {
      await clearVotersGenerated();
      for (const citizen of this.citizens) {
        if (citizen.status === "verified") {
          const id = getCryptoBlockIdentifier().generateIdentifier(8);
          const encrypted = getCryptoBlockIdentifier().encryptData(
            citizen.electoralId,
          );
          const obj: Voter = {
            identifier: id,
            IV: encrypted.IV,
            electoralId: encrypted.CIPHER_TEXT,
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
    } catch (e: unknown) {
      console.error("Error generating identifiers:", e);
      return [];
    }
  }

  public async clearCandidates() {
    try {
      await clearCandidatesTemp();
      await clearCandidates();
      this.candidates = [];
    } catch (e: unknown) {
      console.error("Error clearing candidates:", e);
    }
    return this.candidates;
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
        name,
        num_votes: 0,
        code,
        acronym,
        party,
        status,
      };
      await writeCandidateTemp(code, obj);
      this.candidates = await readCandidatesTemp();
      return this.candidates;
    } catch (e: unknown) {
      console.error("Error adding candidate:", e);
      return [];
    }
  }

  public async authMobile(electoralId: string, password: string) {
    try {
      const response = await readCitizen(electoralId);
      if (!response) return null;
      const match = await bcrypt.compare(password, response.password);
      if (match)
        return {
          electoralId: response.electoralId,
          address: response.address,
          email: response.email,
          province: response.province,
        };
    } catch (e: unknown) {
      console.error("Authentication error:", e);
    }
    return null;
  }

  public async authWeb(username: string, password: string) {
    try {
      const response = await readUser(username);
      if (!response) return null;
      const match = await bcrypt.compare(password, response.password);
      if (match)
        return {
          name: response.name,
          username: response.username,
          role: response.role,
        };
    } catch (e: unknown) {
      console.error("Authentication error:", e);
    }
    return null;
  }

  public async eraseCitzens() {
    try {
      await clearCitizens();
      await this.loadCitizens();
    } catch (e: unknown) {
      console.error("Error erasing citizens:", e);
    }
  }

  public async eraseUsers() {
    try {
      await clearUsers();
      await this.loadUsers();
    } catch (e: unknown) {
      console.error("Error erasing users:", e);
    }
    return this.users;
  }

  public async eraseUser(key: string) {
    try {
      await removeUser(key);
      await this.loadUsers();
    } catch (e: unknown) {
      console.error("Error erasing user:", e);
    }
    return this.users;
  }

  public async eraseRegister(key: string) {
    try {
      await removeCitizen(key);
      await this.loadCitizens();
    } catch (e: unknown) {
      console.error("Error erasing citizen:", e);
    }
    return this.citizens;
  }

  public async saveCitizen(citizen: Citizen) {
    try {
      await writeCitizen(citizen.electoralId, citizen);
    } catch (e: unknown) {
      console.error("Error saving citizen:", e);
    }
  }

  public async saveUser(user: User) {
    try {
      await writeUser(user.username, user);
    } catch (e: unknown) {
      console.error("Error saving user:", e);
    }
  }

  public async updateTokenCitzen(electoralId: string, refreshToken: string) {
    const citizen = this.citizens.find(
      (x) => x.electoralId.localeCompare(electoralId) === 0,
    );
    if (!citizen) {
      console.error("Citizen not found for token update:", electoralId);
      return;
    }
    citizen.refreshToken = refreshToken;
    try {
      await this.saveCitizen(citizen);
    } catch (e: unknown) {
      console.error("Error updating citizen token:", e);
    }
    this.citizens = [
      ...this.citizens.filter((x) => x.electoralId !== citizen.electoralId),
      citizen,
    ];
  }

  public async updateTokenUser(username: string, refreshToken: string) {
    const user = this.users.find(
      (x) => x.username.localeCompare(username) === 0,
    );
    if (!user) return;
    user.refreshToken = refreshToken;
    try {
      await this.saveUser(user);
    } catch (e: unknown) {
      console.error("Error updating user token:", e);
    }
    this.users = [
      ...this.users.filter((x) => x.username !== user.username),
      user,
    ];
  }

  public async addCitzen(data: any): Promise<boolean> {
    if (this.citizens.some((x) => x.email === data.email)) return false;
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
    if (this.citizens.some((x) => x.electoralId === citizen.electoralId))
      return false;
    this.citizens.push(citizen);
    await this.saveCitizen(citizen);
    return true;
  }

  public async updateCitizen(data: any): Promise<boolean> {
    try {
      await this.loadCitizens();
      const old = this.citizens.find((x) => x.electoralId === data.electoralId);
      if (old) {
        Object.assign(old, {
          name: data.name,
          email: data.email,
          address: data.address,
          province: data.province,
          status: data.status,
        });
        await this.saveCitizen(old);
        return true;
      }
    } catch (e: unknown) {
      console.error("Error updating citizen:", e);
    }
    return false;
  }

  public async updateUser(data: any): Promise<boolean> {
    try {
      await this.loadUsers();
      const old = this.users.find((x) => x.username === data.username);
      if (old) {
        const updated: Partial<User> = {
          name: data.name,
          role: data.role === "admin" ? Role.ADMIN : Role.NORMAL,
        };
        if (data.password)
          updated.password = await bcrypt.hash(data.password, 10);
        Object.assign(old, updated);
        await this.saveUser(old);
        return true;
      }
    } catch (e: unknown) {
      console.error("Error updating user:", e);
    }
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
    if (this.users.some((x) => x.username === user.username)) return null;
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
    } catch (e: unknown) {
      console.error("Error deploying announcement:", e);
    }
    return null;
  }

  public async getAnnouncement() {
    try {
      this.announcement = await readAnnouncement();
    } catch (e: unknown) {
      console.error("Error getting announcement:", e);
    }
    return this.announcement;
  }

  public generateOtp(): Otp {
    const secret = speakeasy.generateSecret({
      name: "Election QuantumBallot",
      length: 6,
      step: 300,
    });
    return {
      ascii: secret.ascii,
      hex: secret.hex,
      base32: secret.base32,
      otpauth_url: secret.otpauth_url,
    };
  }

  public verifyOtp(secret: string, token: string): boolean {
    try {
      return speakeasy.totp.verify({ secret, encoding: "base32", token });
    } catch (e: unknown) {
      console.error("Error verifying OTP:", e);
      return false;
    }
  }

  public generateQRCode = async (
    otpauth_url: string,
  ): Promise<string | null> => {
    try {
      return await new Promise<string>((resolve, reject) => {
        qrcode.toDataURL(otpauth_url, (err: any, data: string) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } catch (e: unknown) {
      console.error("Failed to generate QR code:", e);
      return null;
    }
  };

  public getCitizens() {
    return this.citizens;
  }
  public getUsers() {
    return this.users;
  }
  public getRefreshTokens() {
    return this.citizens.map((x) => x.refreshToken);
  }

  public async getVotersGenerated() {
    try {
      this.votersGenerated = await readVoterGenerated();
    } catch (e: unknown) {
      console.error("Error getting voters generated:", e);
    }
    return this.votersGenerated;
  }

  public async getCandidates() {
    try {
      this.candidates = await readCandidatesTemp();
    } catch (e: unknown) {
      console.error("Error getting candidates:", e);
    }
    return this.candidates;
  }
}

export default Committee;
