const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserId } = require('../auth');
const { secret, expiresIn } = require('../config/auth');
const { isEmail } = require('../utils');

const signup = async (parent, args, context, info) => {

  const { email, password, name } = args;

  if (!email || !password || !name) throw new Error('Fields name, email and password are required');

  if (!isEmail(email)) throw new Error('The informed email is invalid');

  if (password.length < 6) throw new Error('The password must contain at least 6 characters');

  const userExists = await context.prisma.user.findOne({ where: { email } });

  if (userExists) throw new Error('The informed email is already in use');

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await context.prisma.user.create({ data: { email, password: encryptedPassword, name } });

  const token = jwt.sign({ userId: user.id }, secret, { expiresIn });

  return {
    token,
    user
  };
}

const login = async (parent, args, context, info) => {

  const { email, password } = args;

  if (!email || !isEmail(email) || !password || password.length < 6) throw new Error('Invalid email or password');

  const user = await context.prisma.user.findOne({ where: { email } });

  if (!user) throw new Error('Invalid email or password');

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) throw new Error('Invalid email or password');

  const token = jwt.sign({ userId: user.id }, secret, { expiresIn });

  return {
    token,
    user
  };
}

const post = (parent, args, context, info) => {

  const userId = getUserId(context);

  const { url, description } = args;

  if (!url || !description) throw new Error('Fields url and description are required');

  const newLink = context.prisma.link.create({
    data: {
      url,
      description,
      postedBy: {
        connect: {
          id: userId
        }
      }
    }
  });

  context.pubsub.publish('NEW_LINK', newLink);

  return newLink;
}

const vote = async (parent, args, context, info) => {

  const userId = getUserId(context);

  const { linkId } = args;

  if (!linkId) throw new Error('Field linkId are required');

  const vote = await context.prisma.vote.findOne({
    where: {
      linkId_userId: {
        linkId: Number(linkId),
        userId
      }
    }
  });

  if (Boolean(vote)) throw new Error('The informed user has already voted for the link');

  const newVote = context.prisma.vote.create({
    data: {
      user: {
        connect: {
          id: userId
        }
      },
      link: {
        connect: {
          id: Number(linkId)
        }
      }
    }
  });

  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
}

module.exports = {
  signup,
  login,
  post,
  vote
}