export const authError = (code)=>{
    const errors={
        400:'USER ALREADY EXISTS OR DUPLICATED DATA',
        500:'USER ALREADY EXISTS OR DUPLICATED DATA',
        401: 'INVALID CREDENTIALS',
        403:'NOT AUTHORIZED',
    }
    let message = errors[code]
    return message
}