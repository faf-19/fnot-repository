import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/db";
import StudentRegister from "../../models/StudentRegister";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await dbConnect();
      const student = new StudentRegister(req.body);
      await student.save();
      res.status(201).json({ success: true, student });
    } catch (error) {
      console.error("Failed to create student:", error);
      res.status(500).json({ success: false, error: "Failed to create student" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}