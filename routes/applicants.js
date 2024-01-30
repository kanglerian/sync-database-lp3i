const express = require("express");
const router = express.Router();
const axios = require("axios");

const { Applicant, ApplicantFamily, School } = require("../models");

/* GET applicants listing. */
router.get("/", async (req, res) => {
    let applicants = await Applicant.findAll();
    res.json(applicants);
});

router.get("/sync/:identity/:sheet", async (req, res) => {
    try {
        const response = await axios.get(
            `https://script.google.com/macros/s/AKfycbyq8NzlVbO2n8kRrkRYMDmZNjRb4aNmV0clLvAKOa5ej-XgZzTA2VL35X2VM7BMl5Br/exec?person=${req.params.sheet}`
        );
        let applicants = response.data;
        let identityUser = req.params.identity;

        const isValidDate = (dateString) => {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            return regex.test(dateString);
        }

        const handleSchoolCheck = async (name) => {
            let school = await School.findOne({
                where: {
                    id: name,
                },
            });
            return school;
        };

        const handleSchoolNameCheck = async (name) => {
            let school = await School.findOne({
                where: {
                    name: name,
                },
            });
            return school;
        };

        const createData = async (
            applicants,
            i,
            phone,
            school,
            gender,
            identityUser,
            come,
            kip,
            known,
            program,
            createFather,
            createMother,
            samePhone = null
        ) => {
            let data_applicant = {
                identity: applicants[i][1],
                pmb: applicants[i][2],
                name: applicants[i][3]
                    ? applicants[i][3]
                        .toLowerCase()
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")
                    : null,
                phone: samePhone === null ? phone : null,
                education: applicants[i][6] || null,
                school: school,
                major: applicants[i][8] || null,
                year: applicants[i][10] || null,
                place_of_birth: applicants[i][11] || null,
                date_of_birth: isValidDate(applicants[i][12]) ? applicants[i][12] : null,
                gender: gender,
                religion: applicants[i][14] || null,
                identity_user: identityUser,
                source_id: 7,
                status_id: 1,
                followup_id: 1,
                come: come,
                achievement: applicants[i][20] || null,
                kip: kip,
                relation: applicants[i][25] || null,
                known: known,
                planning: applicants[i][26] || null,
                program: program,
                other_campus: applicants[i][28] || null,
                income_parent: applicants[i][29] || null,
                social_media: applicants[i][30] || null,
            };

            await Applicant.create(data_applicant);
            await ApplicantFamily.create(createFather);
            await ApplicantFamily.create(createMother);
        };

        const updateData = async (
            student,
            applicants,
            i,
            phone,
            school,
            gender,
            identityUser,
            come,
            kip,
            known,
            program,
            samePhone = null
        ) => {
            let data_applicant = {
                pmb: applicants[i][2],
                name: applicants[i][3] ? applicants[i][3].toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() +
                    word.slice(1)).join(' ') : null,
                phone: (samePhone === null) ? phone : null,
                education: applicants[i][6] || null,
                school: school,
                major: applicants[i][8] || null,
                year: applicants[i][10] || null,
                place_of_birth: applicants[i][11] || null,
                date_of_birth: isValidDate(applicants[i][12]) ? applicants[i][12] : null,
                gender: gender,
                religion: applicants[i][14] || null,
                identity_user: identityUser,
                source_id: 7,
                status_id: 1,
                followup_id: 1,
                come: come,
                achievement: applicants[i][20] || null,
                kip: kip,
                relation: applicants[i][25] || null,
                known: known,
                planning: applicants[i][26] || null,
                program: program,
                other_campus: applicants[i][28] || null,
                income_parent: applicants[i][29] || null,
                social_media: applicants[i][30] || null,
            };

            let data_father = {
                job: applicants[i][21] || null
            }

            let data_mother = {
                job: applicants[i][22] || null
            }

            if (student !== null) {
                await ApplicantFamily.update(data_father, {
                    where: {
                        identity_user: student.dataValues.identity_user,
                    }
                });

                await ApplicantFamily.update(data_mother, {
                    where: {
                        identity_user: student.dataValues.identity_user,
                    }
                });

                await Applicant.update(data_applicant, {
                    where: {
                        id: student.dataValues.id,
                    }
                });

            }
        };


        for (let i = 1; i < applicants.length; i++) {
            let come = null;
            let known = null;
            let program = null;
            let kip = null;
            let school;
            let gender;
            let phone;

            /* Phone Setting */
            let applicantPhone = applicants[i][4];
            let phoneResult = applicantPhone ? applicantPhone.toString() : '';

            if (phoneResult.length > 10) {
                if (phoneResult.startsWith("0")) {
                    phone = "62" + phoneResult.substring(1);
                } else {
                    phone = "62" + phoneResult;
                }
            } else {
                phone = null;
            }

            /* Gender Setting */
            if (applicants[i][13] === "WANITA" || applicants[i][13] === "PEREMPUAN") {
                gender = 0;
            } else if (!applicants[i][13]) {
                gender = null;
            } else {
                gender = 1;
            }

            /* School Setting */
            let schoolName = applicants[i][7];

            let schoolCheck = await handleSchoolCheck(schoolName);
            let schoolNameCheck = await handleSchoolNameCheck(schoolName);

            if (schoolCheck !== null) {
                school = schoolCheck.dataValues.id;
            } else {
                if (schoolNameCheck !== null) {
                    school = schoolNameCheck.dataValues.id;
                } else {
                    let data = {
                        name: schoolName.toUpperCase(),
                        region: "TIDAK KETAHUI",
                    };
                    let schoolCreate = await School.create(data);
                    school = schoolCreate.id;
                }
            }

            /* Father Setting */
            let createFather = {
                identity_user: applicants[i][1],
                gender: 1,
                job: applicants[i][1] ? applicants[i][1] : null,
            };

            /* Mother Setting */
            let createMother = {
                identity_user: applicants[i][1],
                gender: 0,
                job: applicants[i][1] ? applicants[i][1] : null,
            };

            if (
                applicants[i][0] &&
                applicants[i][1] &&
                applicants[i][2] &&
                applicants[i][3]
            ) {
                if (phone) {
                    let studentDataPhone = await Applicant.findOne({
                        where: {
                            identity: applicants[i][1],
                            phone: phone,
                        },
                    });
                    if (studentDataPhone) {
                        if (studentDataPhone.is_applicant == 0) {
                            updateData(studentDataPhone, applicants, i, phone, school, gender, identityUser, come, kip, known, program);
                        }
                    } else {
                        let studentData = await Applicant.findOne({
                            where: {
                                identity: applicants[i][1],
                            },
                        });
                        if (studentData) {
                            if (studentData.is_applicant == 0) {
                                let studentPhone = await Applicant.findOne({
                                    where: {
                                        phone: phone,
                                    },
                                });
                                if (studentPhone) {
                                    if (
                                        studentPhone.is_applicant == 0 &&
                                        studentPhone.is_daftar == 0 &&
                                        studentPhone.is_register == 0 &&
                                        studentPhone.schoolarship == 0
                                    ) {
                                        let samePhone = true;
                                        updateData(studentData, applicants, i, phone, school, gender, identityUser, come, kip, known, program, samePhone);
                                    }
                                } else {
                                    updateData(studentData, applicants, i, phone, school, gender, identityUser, come, kip, known, program);
                                }
                            }
                        } else {
                            let studentPhoneDup = await Applicant.findOne({
                                where: {
                                    phone: phone,
                                },
                            });
                            if (studentPhoneDup) {
                                let samePhone = true;
                                createData(
                                    applicants,
                                    i,
                                    phone,
                                    school,
                                    gender,
                                    identityUser,
                                    come,
                                    kip,
                                    known,
                                    program,
                                    createFather,
                                    createMother,
                                    samePhone
                                );
                            } else {
                                createData(
                                    applicants,
                                    i,
                                    phone,
                                    school,
                                    gender,
                                    identityUser,
                                    come,
                                    kip,
                                    known,
                                    program,
                                    createFather,
                                    createMother
                                );
                            }
                        }
                    }
                } else {
                    let studentData = await Applicant.findOne({
                        where: {
                            identity: applicants[i][1],
                        },
                    });
                    if (studentData) {
                        let samePhone = true;
                        updateData(studentData, applicants, i, phone, school, gender, identityUser, come, kip, known, program,
                            samePhone);
                    } else {
                        let samePhone = true;
                        createData(applicants, i, phone, school, gender, identityUser, come, kip, known, program, createFather,
                            createMother, samePhone);
                    }
                }
            }

        }

        return res.status(200).json({ message: 'Berhasil sinkronisasi' });
    } catch (error) {
        return res.status(500).json({ error: "Terjadi kesalahan pada server." });
    }
});

module.exports = router;
module.exports = router;
