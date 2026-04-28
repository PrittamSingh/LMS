import { clerkClient } from '@clerk/express'
import Course from '../models/Course.js';
import { v2 as cloudinary } from 'cloudinary'

// update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const {userId} = req.auth();
        // console.log("USER ID:", userId);

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        })

        res.json({ success: true, message: 'You can publish a course now' })
    } catch (error) {
        // console.log("❌ ERROR FULL:", error);
        res.json({ success: false, message: error.message })
    }
}

// Add New Course
// export const addCourse = async (req, res) => {
//     try {
//         const { courseData } = req.body
//         const imageFile = req.file
//         // const educatorId = req.auth().userId;
//         const { userId } = req.auth();
//         console.log("FILE:", imageFile);
//         console.log("PATH:", imageFile?.path);

//         if (!imageFile) {
//             return res.json({ success: false, message: "Thumbnail Not Attached" });
//         }

//         const parsedCourseData = JSON.parse(courseData);
//         // parsedCourseData.educator = educatorId;
//         // const newCourse = await Course.create(parsedCourseData)
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path)
//         parsedCourseData.courseThumbnail = imageUpload.secure_url;
//         parsedCourseData.educator = userId;
//         const newCourse = await Course.create(parsedCourseData);
//         // newCourse.courseThumbnail = imageUpload.secure_url
//         // await newCourse.save()

//         res.json({ success: true, message: 'Course Added' })

//     } catch (error) {
//         console.log("❌ ERROR FULL:", error);
//         res.json({ success: false, message: error.message });
//     }
// };


export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if (!imageFile) {
            return res.json({ success: false, message: "Thumbnail Not Attached" });
        }

        const parsedCourseData = JSON.parse(courseData);
        parsedCourseData.educator = educatorId;
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        parsedCourseData.courseThumbnail = imageUpload.secure_url;
        const newCourse = await Course.create(parsedCourseData);
        await newCourse.save()

        res.json({ success: true, message: "Course Added", course: newCourse });

    } catch (error) {
        console.log("❌ ERROR FULL:", error);
        res.json({ success: false, message: error.message });
    }
};