/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export interface UserInfo {
  /**
   * 显示姓名
   *
   * User name displayed
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  name: string;

  /**
   * 用户头像
   *
   * User avatar
   */
  avatar: string;

  /**
   * 用户对象 ID
   *
   * User object ID
   */
  id: string | number;

  /**
   * 用户身份
   *
   * User role
   */
  type: 'administrator' | 'guest';
}