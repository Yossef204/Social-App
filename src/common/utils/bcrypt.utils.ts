import * as bcrypt from 'bcrypt';
// hash function 
// compare function

export const hash = async (data: string) => {
   return bcrypt.hash(data,10);
}

export const compare = async (data : string , hashedData : string) => {
    return bcrypt.compare(data,hashedData);
}