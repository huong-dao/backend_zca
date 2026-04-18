export type ZaloGroupRecord = {
  id: string;
  groupName: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateMultipleZaloGroupsResult = {
  created: ZaloGroupRecord[];
  skipped: {
    existingGroupZaloIds: string[];
    duplicateInputGroupZaloIds: string[];
  };
  summary: {
    requested: number;
    uniqueRequested: number;
    created: number;
    skippedExisting: number;
    skippedDuplicateInput: number;
  };
};
