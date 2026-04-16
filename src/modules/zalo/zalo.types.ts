export enum ZaloThreadType {
  User = 0,
  Group = 1,
}

export enum ZaloLoginQrEventType {
  QRCodeGenerated = 0,
  QRCodeExpired = 1,
  QRCodeScanned = 2,
  QRCodeDeclined = 3,
  GotLoginInfo = 4,
}

export type ZaloUserProfile = {
  userId: string;
  displayName: string;
  zaloName: string;
  phoneNumber: string;
};

export type ZaloUserInfoResponse = {
  changed_profiles: Record<string, ZaloUserProfile>;
};

export type ZaloGroupInfo = {
  groupId: string;
  name: string;
  currentMems: Array<{
    id: string;
    dName: string;
    zaloName: string;
  }>;
};

export type ZaloGroupInfoResponse = {
  gridInfoMap: Record<string, ZaloGroupInfo>;
};

export type ZaloGetAllGroupsResponse = {
  version: string;
  gridVerMap: Record<string, string>;
};

export type ZaloAddUserToGroupResponse = {
  errorMembers: string[];
  error_data: Record<string, string[]>;
};

export type ZaloSendMessageResponse = {
  message: {
    msgId: number;
  } | null;
  attachment: Array<{
    msgId: number;
  }>;
};

export type ZaloSendMessageWithMetaResponse = ZaloSendMessageResponse & {
  cliMsgId: string;
};

export type ZaloDeleteMessageDestination = {
  data: {
    cliMsgId: string;
    msgId: string;
    uidFrom: string;
  };
  threadId: string;
  type?: ZaloThreadType;
};

export type ZaloDeleteMessageResponse = {
  status: number;
};

export type ZaloUndoPayload = {
  msgId: string | number;
  cliMsgId: string | number;
};

export type ZaloUndoResponse = {
  status: number;
};

export type ZaloMessageContent = {
  msg: string;
};

export type ZaloCredentials = {
  cookie: unknown[];
  imei: string;
  userAgent: string;
  language?: string;
};

export type ZaloLoginQrCallbackEvent =
  | {
      type: ZaloLoginQrEventType.QRCodeGenerated;
      data: {
        image: string;
      };
    }
  | {
      type: ZaloLoginQrEventType.QRCodeExpired;
      data: null;
    }
  | {
      type: ZaloLoginQrEventType.QRCodeScanned;
      data: {
        display_name: string;
      };
    }
  | {
      type: ZaloLoginQrEventType.QRCodeDeclined;
      data: {
        code: string;
      };
    }
  | {
      type: ZaloLoginQrEventType.GotLoginInfo;
      data: {
        cookie: unknown[];
        imei: string;
        userAgent: string;
      };
    };

export interface ZaloApi {
  getOwnId(): string;
  getUserInfo(userId: string | string[]): Promise<ZaloUserInfoResponse>;
  getAllGroups(): Promise<ZaloGetAllGroupsResponse>;
  getGroupInfo(groupId: string | string[]): Promise<ZaloGroupInfoResponse>;
  addUserToGroup(
    memberId: string | string[],
    groupId: string,
  ): Promise<ZaloAddUserToGroupResponse>;
  sendMessage(
    message: string | ZaloMessageContent,
    threadId: string,
    type?: ZaloThreadType,
  ): Promise<ZaloSendMessageResponse>;
  deleteMessage(
    destination: ZaloDeleteMessageDestination,
    onlyMe?: boolean,
  ): Promise<ZaloDeleteMessageResponse>;
  undo(
    payload: ZaloUndoPayload,
    threadId: string,
    type?: ZaloThreadType,
  ): Promise<ZaloUndoResponse>;
  sendFriendRequest(message: string, userId: string): Promise<string>;
  acceptFriendRequest(userId: string): Promise<string>;
}

export interface ZaloClient {
  login(credentials: ZaloCredentials): Promise<ZaloApi>;
  loginQR(
    options?: {
      userAgent?: string;
      language?: string;
      qrPath?: string;
    },
    callback?: (event: ZaloLoginQrCallbackEvent) => unknown,
  ): Promise<ZaloApi>;
}

export type ZcaJsModule = {
  Zalo: new (options?: {
    selfListen?: boolean;
    checkUpdate?: boolean;
    logging?: boolean;
  }) => ZaloClient;
};
