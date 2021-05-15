const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { Admin, Mentor, Intern, Supervisor } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    const user = await findUserTypeById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const findUserTypeById = async(id) => {
  const admin      = await Admin.findOne({ _id: id });
  const mentor     = await Mentor.findOne({ _id: id });
  const intern     = await Intern.findOne({ _id: id });
  const supervisor = await Supervisor.findOne({ _id: id });
  if(admin)        { return user = admin };
  if(mentor)       { return user = mentor };
  if(intern)       { return user = intern };
  if(supervisor)   { return user = supervisor };
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
