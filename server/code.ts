import { CodeModel } from "./models/code";
import { GenezioAuth, GenezioDeploy, GnzContext } from "@genezio/types";
import { connectDb, initTables, syncDb } from "./db/connect";
import validator from "validator";

const red_color = "\x1b[31m%s\x1b[0m";
const missing_env_error =
  "ERROR: Your POSTGRES_URL environment variable is not properly set, go to https://genezio.com/docs/features/databases to learn how to create a free tier postgres database for your project";

export type Code = {
  codeId: string;
  title: string;
  ownerId: string;
  codeText: string;
  date: Date;
};

export type GetCodesResponse = {
  success: boolean;
  codes: Code[];
};

export type GetCodeResponse = {
  success: boolean;
  code: Code;
};

/**
 * The Code server class that will be deployed on the genezio infrastructure.
 */
@GenezioDeploy()
export class CodeService {
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

  /**
   * Method that returns all codes for the authentficated user.
   * Only authenticated users with a valid token can access this method.
   *
   * The method will be exported via SDK using genezio.
   *
   * @param {*} context The genezio context for the authentification session.
   * @returns An object containing two properties: { success: true, codes: codes }
   */
  @GenezioAuth()
  async getAllCodes(context: GnzContext): Promise<GetCodesResponse> {
    if (!process.env.POSTGRES_URL) {
      console.log(red_color, missing_env_error);
      throw new Error(missing_env_error);
    }
    const ownerId = context.user?.userId;
    if (!ownerId) {
      throw new Error("User not authentificated or token has expired");
    }

    console.log(
      `Get all codes by user request received with userID ${context.user?.userId}`
    );
    const codes = await CodeModel.findAll({
      where: { ownerId: ownerId },
    }).catch((error) => {
      console.log(error);
      throw new Error("Error getting codes");
    });

    return { success: true, codes: codes };
  }

  /**
   * Method that creates a code for the authentficated user.
   * Only authenticated users with a valid token can access this method.
   *
   * The method will be exported via SDK using genezio.
   *
   * @param {*} context The genezio context for the authentification session
   * @param {*} title The code title.
   * @param {*} codeText The code text used to generate the qr code.
   * @returns An object containing two properties: { success: true, code: code }
   */
  @GenezioAuth()
  async createCode(
    context: GnzContext,
    title: string,
    codeText: string
  ): Promise<GetCodeResponse> {
    if (!process.env.POSTGRES_URL) {
      console.log(red_color, missing_env_error);
      throw new Error(missing_env_error);
    }
    console.log(`Create code request received with title ${title}`);
    const ownerId = context.user?.userId;
    if (!ownerId) {
      throw new Error("User not authentificated or token has expired");
    }

    const isValidUrl = validator.isURL(codeText, {
      protocols: ["http", "https"],
      require_protocol: true,
    });
    if (!isValidUrl) {
      throw new Error("The code text is not a valid URL");
    }

    const code = await CodeModel.create({
      title: title,
      codeText: codeText,
      ownerId: ownerId,
      date: new Date(),
    }).catch((error) => {
      console.log(error);
      throw new Error("Error creating code");
    });
    return {
      success: true,
      code: code,
    };
  }

  /**
   * Method that returns a code for the authentficated user.
   * Only authenticated users with a valid token can access this method.
   *
   * The method will be exported via SDK using genezio.
   *
   * @param {*} context The genezio context for the authentification session.
   * @param {*} codeId The code's id.
   * @returns The code object.
   */
  @GenezioAuth()
  async getCode(context: GnzContext, codeId: string): Promise<Code | null> {
    if (!process.env.POSTGRES_URL) {
      console.log(red_color, missing_env_error);
      throw new Error(missing_env_error);
    }

    const ownerId = context.user?.userId;
    if (!ownerId) {
      throw new Error("User not authentificated or token has expired");
    }

    const code = await CodeModel.findOne({ where: { codeId: codeId } }).catch(
      (error) => {
        console.log(error);
        throw new Error("Error getting code");
      }
    );
    if (!code) {
      throw new Error("Code not found");
    }

    return code;
  }

  /**
   * Method that updates a code for the authentficated user.
   * Only authenticated users with a valid token can access this method.
   *
   * The method will be exported via SDK using genezio.
   *
   * @param {*} context The genezio context for the authentification session.
   * @param {*} id The code's id.
   * @param {*} title The code's title.
   * @param {*} codeText The code text used to generate the qr.
   * @returns An object containing one property: { success: true }
   */
  @GenezioAuth()
  async updateCode(
    context: GnzContext,
    id: string,
    title: string,
    codeText: string
  ): Promise<GetCodeResponse> {
    if (!process.env.POSTGRES_URL) {
      console.log(red_color, missing_env_error);
      throw new Error(missing_env_error);
    }
    const ownerId = context.user?.userId;
    if (!ownerId) {
      throw new Error("User not authentificated or token has expired");
    }
    console.log(
      `Update code request received with id ${id} with title ${title} and code text ${codeText}`
    );
    const isValidUrl = validator.isURL(codeText, {
      protocols: ["http", "https"],
      require_protocol: true,
    });
    if (!isValidUrl) {
      throw new Error("The code text is not a valid URL");
    }

    const code = await CodeModel.findOne({
      where: { codeId: id, ownerId: ownerId },
    }).catch((error) => {
      console.log(error);
      throw new Error("Error getting code");
    });
    if (!code) {
      throw new Error(
        "Code does not exist or the user doesn't have access to it"
      );
    }

    try {
      code.set({
        title: title,
        codeText: codeText,
      });
      await code.save();
      return { success: true, code: code };
    } catch (error) {
      console.log(error);
      throw new Error("Error updating code");
    }
  }

  /**
   * Method that deletes a code for the authentficated user.
   * Only authenticated users with a valid token can access this method.
   *
   * The method will be exported via SDK using genezio.
   *
   * @param {*} context The genezio context for the authentification session.
   * @param {*} id The code's id.
   * @returns An object containing one property: { success: true }
   */
  @GenezioAuth()
  async deleteCode(context: GnzContext, id: string): Promise<void> {
    if (!process.env.POSTGRES_URL) {
      console.log(red_color, missing_env_error);
      throw new Error(missing_env_error);
    }
    const ownerId = context.user?.userId;
    if (!ownerId) {
      throw new Error("User not authentificated or token has expired");
    }

    console.log(`Delete code with id ${id} request received`);

    const code = await CodeModel.findOne({
      where: { codeId: id, ownerId: ownerId },
    }).catch((error) => {
      console.log(error);
      throw new Error("Error getting code");
    });
    if (!code) {
      throw new Error(
        "Code does not exist or the user doesn't have access to it"
      );
    }

    await code.destroy().catch((error) => {
      console.log(error);
      throw new Error("Error deleting code");
    });
  }
}
