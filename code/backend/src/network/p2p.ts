import axios from "axios";

export interface PeerData {
  peerId: string;
  url: string;
}

class P2P {
  peers: Map<string, PeerData>;
  myPeer!: PeerData;

  constructor() {
    this.peers = new Map();
  }

  public setMyPeerData(data: PeerData) {
    this.myPeer = data;
  }

  public addPeer(data: PeerData) {
    if (
      this.myPeer &&
      data.peerId !== this.myPeer.peerId &&
      !this.peers.has(data.peerId)
    ) {
      this.peers.set(data.peerId, data);
    }
  }

  public removePeer(peerId: string) {
    this.peers.delete(peerId);
  }

  public containsPeer(peerId: string) {
    return this.peers.has(peerId);
  }

  public getPeers(): PeerData[] {
    return Array.from(this.peers.values());
  }

  public async broadcastPeers(data: PeerData) {
    this.addPeer(data);
    const peers = this.getPeers();

    try {
      await Promise.all(
        peers.map((x) => axios.post(`${x.url}/register-node`, data)),
      );
      await axios.post(`${data.url}/register-nodes-bulk`, {
        nodes: [...peers, this.myPeer],
      });
    } catch (err: unknown) {
      console.error("Error during P2P broadcast:", err);
    }
  }
}

module.exports = P2P;
