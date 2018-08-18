import Mock from 'mockjs';

export function login (req, res) {
  const { password, userName, type } = req.body;
  if (password === '888888' && userName === 'admin') {
    res.send({
      msg: 'success',
      code: 0,
      expire: Mock.Random.natural(60 * 60 * 1, 60 * 60 * 12),
      token: Mock.Random.string('abcdefghijklmnopqrstuvwxyz0123456789', 32),
      currentAuthority: ['admin','user'],
    });
    return;
  }
  if (password === '123456' && userName === 'user') {
    res.send({
      msg: 'success',
      code: 0,
      expire: Mock.Random.natural(60 * 60 * 1, 60 * 60 * 12),
      token: Mock.Random.string('abcdefghijklmnopqrstuvwxyz0123456789', 32),
      currentAuthority: 'user',
    });
    return;
  }
  res.send({
    status: 'error',
    currentAuthority: 'guest',
  });
}

export function logout (req, res) {
  res.send({
    msg: 'success',
    code: 0
  });
}
