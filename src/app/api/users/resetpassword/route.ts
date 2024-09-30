import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, newPassword } = reqBody;

    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    console.log(decodedToken);
    const userId = decodedToken._id;

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User does not exists' },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();
    //crerate token data

    const response = NextResponse.json({
      message: 'Password Reset Sucesssfully',
      success: true,
    });

    return response;
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
