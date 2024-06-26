import {
  GenezioDeploy,
  GenezioHttpRequest,
  GenezioHttpResponse,
  GenezioMethod,
} from "@genezio/types";
import { CodeModel } from "./models/code";
import { connectDb, initTables, syncDb } from "./db/connect";
import { TrackingModel } from "./models/tracking";
import { Op } from "sequelize";

const red_color = "\x1b[31m%s\x1b[0m";
const missing_env_error =
  "ERROR: Your POSTGRES_URL environment variable is not properly set, go to https://genezio.com/docs/features/databases to learn how to create a free tier postgres database for your project";

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
      if (!process.env.POSTGRES_URL) {
        console.log(red_color, missing_env_error);
        return;
      }
      const db = connectDb();
      initTables(db);
      syncDb(db);
    } catch (err) {
      console.log(
        "\x1b[33m%s\x1b[0m",
        "WARNING: Check if your environment variables are correctly set"
      );
      console.log(err);
    }
  }

  async getTrackingData(codeId: string): Promise<Track[]> {
    const dateNow = new Date();
    const startOfDay = new Date(dateNow.setHours(0, 0, 0, 0));
    const endOfDay = new Date(dateNow.setHours(23, 59, 59, 999));

    const res = await TrackingModel.findAll({
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
    // @ts-expect-error This is a valid return
    return res;
  }

  /**
   * Http method that tracks a code.
   * All qr codes generated by this service will redirect to this endpoint.
   * This method will then redirect the user to the original url.
   *
   * @param {*} req The http request object.
   * @returns An object containing the statusCode, body and headers.
   */
  @GenezioMethod({ type: "http" })
  async trackCode(req: GenezioHttpRequest): Promise<GenezioHttpResponse> {
    if (!req.queryStringParameters || !req.queryStringParameters.codeId) {
      return {
        statusCode: "400",
        body: "Missing codeId parameter in the request",
      };
    }
    const codeId = req.queryStringParameters.codeId;
    console.log(`Tracking code with id ${codeId}`);
    const code = await CodeModel.findOne({ where: { codeId: codeId } });
    if (!code) {
      return {
        statusCode: "404",
        body: "Code not found",
      };
    }
    const res = await TrackingModel.create({
      codeId: codeId,
      date: new Date(),
    }).catch((error) => {
      console.log(error);
      return null;
    });
    if (!res) {
      return {
        statusCode: "500",
        body: "Error tracking code",
      };
    }

    return {
      statusCode: "303",
      body: "Code tracked successfully",
      headers: {
        Location: code.codeText,
      },
    };
  }
}
