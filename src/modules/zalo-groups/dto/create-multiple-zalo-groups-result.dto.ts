export type ZaloGroupRecord = {
  id: string;
  groupName: string;
  originName: string | null;
  isUpdateName: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateMultipleZaloGroupsResult = {
  created: ZaloGroupRecord[];
  /** Populated when `mode` is `update origin name`: `ZaloGroup` rows whose `originName` was refreshed from the request. */
  updatedOriginName: ZaloGroupRecord[];
  skipped: {
    existingGroupZaloIds: string[];
    duplicateInputGroupZaloIds: string[];
  };
  summary: {
    requested: number;
    uniqueRequested: number;
    created: number;
    updatedOriginName: number;
    skippedExisting: number;
    skippedDuplicateInput: number;
  };
};
