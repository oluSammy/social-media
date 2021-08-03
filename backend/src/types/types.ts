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
  noOfFollowers: number;
  noOfFollowing: number;
  username: string;
}

export interface IFollow {
  userId: string;
  follows: string[];
}
