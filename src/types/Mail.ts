type ISendMail = {
  toAddress: string,
  subject: string,
  content: string,
  userReadOrNot: 'yes' | 'no',
}

export { ISendMail }