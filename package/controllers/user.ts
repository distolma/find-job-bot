import { Message } from 'node-telegram-bot-api';
import { model } from 'mongoose';

import { IUserModel } from '../db/models/User';
import { IVacanciesInquiries } from '../interfaces';

const User = model<IUserModel>('User');

export const createUser = ({
  from: { id, first_name, last_name, username },
}: Message) => new User({ tel_id: id, first_name, last_name, username }).save();

export const updateUser = ({
  from: { id, first_name, last_name, username },
}: Message) =>
  User.findOneAndUpdate(
    { tel_id: id },
    { first_name, last_name, username },
  ).exec();

export const removeUser = (id: number) =>
  User.findOneAndRemove({ tel_id: id }).exec();

export const getUser = (id: number) => User.findOne({ tel_id: id }).exec();

export const getAllUsers = () => User.find();

export const getActiveUsers = () => User.find({ status: 'active' });

export const getPausedUsers = () => User.find({ status: 'pause' });

export const pauseUser = (id: number) =>
  User.findOneAndUpdate({ tel_id: id }, { status: 'pause' }).exec();

export const activateUser = (id: number) =>
  User.findOneAndUpdate({ tel_id: id }, { status: 'active' }).exec();

export const setCity = (id: number, city: string) =>
  User.findOneAndUpdate({ tel_id: id }, { city }).exec();

export const setCategory = (id: number, category: string) =>
  User.findOneAndUpdate({ tel_id: id }, { category }).exec();

export const getVacanciesInquiry = async () => {
  const map: IVacanciesInquiries = {};
  const users = await getActiveUsers();

  users.forEach(user => {
    if (user.category && user.city) {
      if (!map[user.category]) map[user.category] = [];
      map[user.category].push(user.city);
    }
  });

  return map;
};
