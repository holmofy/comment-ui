import { errorCheck } from './utils';
import type { BaseAPIOptions } from './utils';

export interface GetCommentCountOptions extends BaseAPIOptions {
  /**
   * 待获取评论数的 path
   *
   * Path of pages to be fetched
   */
  paths: string[];

  /**
   * 取消请求的信号
   *
   * AbortSignal to cancel request
   */
  signal?: AbortSignal;
}

export const fetchCommentCount = ({
  serverURL,
  lang,
  paths,
  signal,
}: GetCommentCountOptions): Promise<number[]> =>
  fetch(
    `${serverURL}/comment/count?url=${encodeURIComponent(
      paths.join(',')
    )}`,
    { signal }
  )
    .then((resp) => <Promise<number | number[]>>resp.json())
    .then((data) => errorCheck(data, 'comment count'))
    // TODO: Improve this API
    .then((counts) => (Array.isArray(counts) ? counts : [counts]));
