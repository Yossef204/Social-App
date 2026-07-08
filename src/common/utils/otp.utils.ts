export function generateOtp(){
    const min = 100000;
    const max = 900000;
    return Math.floor(Math.random() * min + max);
}