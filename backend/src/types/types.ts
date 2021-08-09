export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string | undefined;
  passwordConfirm?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  bio?: string;
  user: any;
  photo?: string;
  followers: string;
  followings: string;
  username: string;
  profilePic: string;
  coverPhoto: string;
  profilePicCloudinaryId: string;
  coverPhotoCloudinaryId: string;
}

export interface IFollow {
  userId: string;
  follows: string[];
}

export interface IPost {
  _id: string;
  createdBy: IUser;
  photos: { cloudId: string; url: string }[];
  text: string;
}
