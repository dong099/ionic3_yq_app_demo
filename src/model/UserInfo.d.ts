

export interface UserInfo {
  oid_index: number;
  username: string;
  openid?: string;
  nick_name: string;
  sex?: string;
  language?: string;
  city?: string;
  province?: string;
  country?: string;
  head_img_url?: string;
  subscribe_date?: string;
  tel_no?: string;
  email?: string;
  version_id?:number;
  last_upd_time?: string;

}


export interface LoginInfo {
  access_token: string;
  user: UserInfo;
}
