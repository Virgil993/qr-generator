import { GenezioDeploy, GenezioMethod } from "@genezio/types";
import { CodeModel } from "./models/code";
import { connectDb, initTables, syncDb } from "./db/connect";
import { TrackModel } from "./models/track";
import { Op } from "sequelize";

export type Track = {
  id: string;
  codeId: string;
  date: Date;
};

@GenezioDeploy()
export class TrackService {
  constructor() {
    this.#connect();
  }

  /**
   * Private method used to connect to the DB.
   */
  #connect() {
    try {
      const db = connectDb();
      initTables(db);
      syncDb(db);
    } catch (err) {
      console.error(err);
    }
  }

  async getTrackingData(codeId: string): Promise<Track[]> {
    const dateNow = new Date();
    const startOfDay = new Date(dateNow.setHours(0, 0, 0, 0));
    const endOfDay = new Date(dateNow.setHours(23, 59, 59, 999));

    const res = await TrackModel.findAll({
      where: {
        codeId: codeId,
        date: {
          [Op.and]: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay,
          },
        },
      },
    }).catch((error) => {
      console.log(error);
      return null;
    });
    if (!res) {
      throw new Error("Error getting tracking data");
    }
    return res;
  }
}
