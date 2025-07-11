import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('biodata')
export class Biodata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  step: number;

  @Column({ nullable: true })
  partnerAgeMin: number;

  @Column({ nullable: true })
  partnerAgeMax: number;

  @Column({ default: false, nullable: true })
  sameAsPermanent: boolean;

  @Column({ nullable: true })
  religion: string;

  @Column({ nullable: true })
  biodataType: string;

  @Column({ nullable: true })
  maritalStatus: string;

  @Column({ nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  height: string;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  skinColor: string;

  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: true })
  bloodGroup: string;

  @Column({ nullable: true })
  permanentCountry: string;

  @Column({ nullable: true })
  permanentDivision: string;

  @Column({ nullable: true })
  permanentZilla: string;

  @Column({ nullable: true })
  permanentUpazilla: string;

  @Column({ nullable: true })
  permanentArea: string;

  @Column({ nullable: true })
  presentCountry: string;

  @Column({ nullable: true })
  presentDivision: string;

  @Column({ nullable: true })
  presentZilla: string;

  @Column({ nullable: true })
  presentUpazilla: string;

  @Column({ nullable: true })
  presentArea: string;

  @Column({ nullable: true })
  healthIssues: string;

  @Column({ nullable: true })
  educationMedium: string;

  @Column({ nullable: true })
  highestEducation: string;

  @Column({ nullable: true })
  instituteName: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ nullable: true })
  passingYear: number;

  @Column({ nullable: true })
  result: string;

  @Column({ nullable: true })
  economicCondition: string;

  @Column({ nullable: true })
  fatherName: string;

  @Column({ nullable: true })
  fatherProfession: string;

  @Column({ nullable: true })
  fatherAlive: string;

  @Column({ nullable: true })
  motherName: string;

  @Column({ nullable: true })
  motherProfession: string;

  @Column({ nullable: true })
  motherAlive: string;

  @Column({ nullable: true })
  brothersCount: number;

  @Column({ nullable: true })
  sistersCount: number;

  @Column({ nullable: true })
  familyDetails: string;

  @Column({ nullable: true })
  partnerSkinColor: string;

  @Column({ nullable: true })
  partnerHeight: string;

  @Column({ nullable: true })
  partnerEducation: string;

  @Column({ nullable: true })
  partnerProfession: string;

  @Column({ nullable: true })
  partnerLocation: string;

  @Column({ nullable: true })
  partnerDetails: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  guardianMobile: string;

  @Column({ nullable: true })
  ownMobile: string;
}
