import type { API } from 'zca-js';
import type { AvatarSize } from 'zca-js';
import type { DeleteMessageDestination, DeleteMessageResponse } from 'zca-js';
import type { FindUserResponse } from 'zca-js';
import type { GetAllFriendsResponse } from 'zca-js';
import type { GetAllGroupsResponse } from 'zca-js';
import type { GroupInfoResponse } from 'zca-js';
import type { GetFriendRequestStatusResponse } from 'zca-js';
import type { GetQRResponse } from 'zca-js';
import type { MessageContent } from 'zca-js';
import type { AddUserToGroupResponse } from 'zca-js';
import type { SendMessageResponse } from 'zca-js';
import type { UndoPayload, UndoResponse } from 'zca-js';
import type { UserInfoResponse } from 'zca-js';
import { ThreadType } from 'zca-js';

/**
 * Thin wrapper around zca-js `API` for APIs described in `docs/Zalo_Integration.mdc`
 * (except `loginQR`, which remains client-side).
 */
export class ZcaApiHelper {
  constructor(private readonly api: API) {}

  /** Direct access when you need a method not yet wrapped here. */
  get raw(): API {
    return this.api;
  }

  getQR(userId: string | string[]): Promise<GetQRResponse> {
    return this.api.getQR(userId);
  }

  getOwnId(): string {
    return this.api.getOwnId();
  }

  getAllGroups(): Promise<GetAllGroupsResponse> {
    return this.api.getAllGroups();
  }

  getGroupInfo(groupId: string | string[]): Promise<GroupInfoResponse> {
    return this.api.getGroupInfo(groupId);
  }

  getUserInfo(
    userId: string | string[],
    avatarSize?: AvatarSize,
  ): Promise<UserInfoResponse> {
    return this.api.getUserInfo(userId, avatarSize);
  }

  sendFriendRequest(msg: string, userId: string): Promise<''> {
    return this.api.sendFriendRequest(msg, userId);
  }

  getFriendRequestStatus(
    friendId: string,
  ): Promise<GetFriendRequestStatusResponse> {
    return this.api.getFriendRequestStatus(friendId);
  }

  removeFriend(friendId: string): Promise<''> {
    return this.api.removeFriend(friendId);
  }

  acceptFriendRequest(userId: string): Promise<''> {
    return this.api.acceptFriendRequest(userId);
  }

  addUserToGroup(
    memberId: string | string[],
    groupId: string,
  ): Promise<AddUserToGroupResponse> {
    return this.api.addUserToGroup(memberId, groupId);
  }

  sendMessage(
    message: string | MessageContent,
    threadId: string,
    type?: ThreadType,
  ): Promise<SendMessageResponse> {
    return this.api.sendMessage(message, threadId, type);
  }

  deleteMessage(
    destination: DeleteMessageDestination,
    onlyMe?: boolean,
  ): Promise<DeleteMessageResponse> {
    return this.api.deleteMessage(destination, onlyMe);
  }

  getAllFriends(
    count?: number,
    page?: number,
    avatarSize?: AvatarSize,
  ): Promise<GetAllFriendsResponse> {
    return this.api.getAllFriends(count, page, avatarSize);
  }

  undo(
    payload: UndoPayload,
    threadId: string,
    type?: ThreadType,
  ): Promise<UndoResponse> {
    return this.api.undo(payload, threadId, type);
  }

  findUser(
    phoneNumber: string,
    avatarSize?: AvatarSize,
  ): Promise<FindUserResponse> {
    return this.api.findUser(phoneNumber, avatarSize);
  }
}

export { ThreadType };
