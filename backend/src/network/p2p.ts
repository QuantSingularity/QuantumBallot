import axios from "axios";

export interface Data {
  peerId: string;
  url: string;
}

class P2P {
  peers: Map<string, Data>;
  myPeer!: Data;

  constructor() {
    this.peers = new Map<string, Data>();
  }

  public addPeer(data: Data) {
    if (
      this.myPeer &&
      !this.containsPeer(data.peerId) &&
      data.peerId !== this.myPeer.peerId
    ) {
      this.peers.set(data.peerId, data);
    }
  }

  public setMyPeerData(data: Data) {
    this.myPeer = data;
  }

  public removePeer(peerId: string) {
    this.peers.delete(peerId);
  }

  public containsPeer(peerId: string) {
    return this.peers.has(peerId);
  }

  public getPeers() {
    const arr: Data[] = [];
    this.peers.forEach((value, _key) => {
      arr.push(value);
    });

    return arr;
  }

  public async broadcastPeers(data: Data) {
    const newNodeUrl = data.url;
    this.addPeer(data);

    const peers = Array.from(this.peers.values());
    const requests: Promise<any>[] = [];
    peers.forEach((x) => {
      const opt = {
        url: `${x.url}/register-node`,
        method: "post" as const,
        data: data,
      };

      requests.push(axios(opt) as Promise<any>);
    });

    try {
      await Promise.all(requests);

      const opt = {
        url: `${newNodeUrl}/register-nodes-bulk`,
        method: "post" as const,
        data: { nodes: [...peers, this.myPeer] },
      };

      await axios(opt);
    } catch (error: any) {
      console.error("Error occurred during the broadcast:", error);
    }
  }
}

module.exports = P2P;
