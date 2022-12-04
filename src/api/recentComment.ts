import { errorCheck } from './utils';
import type { BaseAPIOptions } from './utils';
import type { WalineComment } from '../typings';

export interface GetRecentCommentOptions extends BaseAPIOptions {
  /**
   * 获取评论的数量
   *
   * Comment numebr to be fetched
   */
  count: number;

  /**
   * 取消请求的信号
   *
   * AbortSignal to cancel request
   */
  signal?: AbortSignal;

  /**
   * 用户令牌
   *
   * User token
   */
  token?: string;
}

export const getRecentComment = ({
  serverURL,
  count
}: GetRecentCommentOptions): Promise<WalineComment[]> => {
  const headers: Record<string, string> = {};

  return fetch(`${serverURL}/comment/recent?count=${count}`, {
    headers,
  })
    .then((resp) => <Promise<WalineComment[]>>resp.json())
    .then((data) => errorCheck(data, 'recent comment'));
};
