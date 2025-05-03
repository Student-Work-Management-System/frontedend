# swms-frondEnd

## 技术栈及部分框架

- Front-end：Vue3 + Pinia + vue-router
- ExcelPlugins：vue3-excel-editor
- UI Components：Vuetify + Element Plus

具体版本：

![image-20250406181507073](README.assets/image-20250406181507073.png)

## 启动

本项目采用`yarn`而非`npm`管理，因此需要启动代码稍有不同

启动：

```bash
yarn run dev
# 完全开放
yarn run dev --host
```

构建：

```bash
yarn build
```

![image-20250406181809832](README.assets/image-20250406181809832.png)

## 项目地址

项目地址：[CodeBerg-SWMS](https://codeberg.org/SWMS/swms-web)

联系方式：

- QQ：`1241142935`

```
swms-web
├─ .eslintrc.cjs
├─ .prettierrc.json
├─ auto-imports.d.ts
├─ components.d.ts
├─ env.d.ts
├─ index.html
├─ package.json
├─ pnpm-lock.yaml
├─ public
│  ├─ favicon.ico
│  ├─ logo-mini.png
│  ├─ logo1.png
│  ├─ logo2.png
│  └─ template
├─ README.assets
│  ├─ image-20250406181507073.png
│  └─ image-20250406181809832.png
├─ README.md
├─ src
│  ├─ api
│  │  ├─ academicWork.ts
│  │  ├─ cadre.ts
│  │  ├─ competition.ts
│  │  ├─ employment.ts
│  │  ├─ file.ts
│  │  ├─ foreign.ts
│  │  ├─ index.ts
│  │  ├─ leave.ts
│  │  ├─ other.ts
│  │  ├─ poverty.ts
│  │  ├─ punishment.ts
│  │  ├─ role.ts
│  │  ├─ scholarship.ts
│  │  ├─ status.ts
│  │  ├─ student.ts
│  │  └─ user.ts
│  ├─ App.vue
│  ├─ assets
│  │  └─ logo2.svg
│  ├─ components
│  │  ├─ basic
│  │  │  └─ RouterContainer.vue
│  │  ├─ home
│  │  │  ├─ academicWork
│  │  │  │  ├─ AcademicWorkDialog.vue
│  │  │  │  ├─ AcademicWorkMemberDailog.vue
│  │  │  │  ├─ AcademicWorkTypeSelect.vue
│  │  │  │  ├─ AddStudentAcademicWorkDialog.vue
│  │  │  │  └─ AuditAcademicWorkDialog.vue
│  │  │  ├─ base
│  │  │  │  └─ EditBaseInfoForm.vue
│  │  │  ├─ cadre
│  │  │  │  ├─ AddCadreForm.vue
│  │  │  │  ├─ CadreSelect.vue
│  │  │  │  ├─ EditCadreForm.vue
│  │  │  │  └─ EditStudentCadre.vue
│  │  │  ├─ competition
│  │  │  │  ├─ AddCompetitionDialog.vue
│  │  │  │  ├─ CompetitionAuditDialog.vue
│  │  │  │  ├─ CompetitionMemberDialog.vue
│  │  │  │  ├─ CompetitionNatureSelect.vue
│  │  │  │  ├─ CompetitionsSelect.vue
│  │  │  │  ├─ CompetitionStudentAddForm.vue
│  │  │  │  ├─ CompetitionTypeSelect.vue
│  │  │  │  ├─ EditCompetitionDialog.vue
│  │  │  │  ├─ LevelSelect.vue
│  │  │  │  ├─ StateSelect.vue
│  │  │  │  └─ StudentSelect.vue
│  │  │  ├─ DateSelect.vue
│  │  │  ├─ DegreeSelect.vue
│  │  │  ├─ DeleteDialog.vue
│  │  │  ├─ employment
│  │  │  │  └─ EditStudentEmploymentDialog.vue
│  │  │  ├─ ExcelTable.vue
│  │  │  ├─ foreign
│  │  │  │  ├─ AddLanguageFrom.vue
│  │  │  │  ├─ EditForeignLanguageFrom.vue
│  │  │  │  ├─ EditLanguageForm.vue
│  │  │  │  └─ LanguageSelect.vue
│  │  │  ├─ GradeSelect.vue
│  │  │  ├─ ItemSelect.vue
│  │  │  ├─ KeyValueSelect.vue
│  │  │  ├─ leave
│  │  │  │  ├─ AddStudentLeaveDialog.vue
│  │  │  │  ├─ CounselorSelect.vue
│  │  │  │  ├─ DestoryLeaveDialog.vue
│  │  │  │  └─ LeaveAuditDialog.vue
│  │  │  ├─ MajorSelect.vue
│  │  │  ├─ MultiInputUserChips.vue
│  │  │  ├─ PoliticSelect.vue
│  │  │  ├─ poverty
│  │  │  │  ├─ AcademicYearSelect.vue
│  │  │  │  ├─ AddPovertyForm.vue
│  │  │  │  ├─ EditPovertyForm.vue
│  │  │  │  └─ EditStudentPovertyForm.vue
│  │  │  ├─ punishment
│  │  │  │  └─ EditStudentPunishmentDialog.vue
│  │  │  ├─ RouterBreadcrumb.vue
│  │  │  ├─ RouterSideMenu.vue
│  │  │  ├─ scholarship
│  │  │  │  ├─ AddScholarshipDialog.vue
│  │  │  │  ├─ EditScholarshipDialog.vue
│  │  │  │  ├─ EditStudentScholarshipDialog.vue
│  │  │  │  └─ ScholarshipSelect.vue
│  │  │  ├─ SemesterSelect.vue
│  │  │  ├─ status
│  │  │  │  ├─ AddStatusForm.vue
│  │  │  │  ├─ EditStatusForm.vue
│  │  │  │  ├─ EditStudentStatusDialog.vue
│  │  │  │  └─ StudentStatusDetailDialog.vue
│  │  │  ├─ StatusSelect.vue
│  │  │  ├─ system
│  │  │  │  ├─ AddCounselorForm.vue
│  │  │  │  ├─ AddOtherForm.vue
│  │  │  │  ├─ AddRoleForm.vue
│  │  │  │  ├─ AddUserForm.vue
│  │  │  │  ├─ CounselorFrom.vue
│  │  │  │  ├─ EditCounselorForm.vue
│  │  │  │  ├─ EditUserInfoForm.vue
│  │  │  │  ├─ EditUserRoleForm.vue
│  │  │  │  ├─ MajorForm.vue
│  │  │  │  └─ SelectPermission.vue
│  │  │  ├─ TrueOrFalseSelect.vue
│  │  │  └─ UploadDialog.vue
│  │  └─ login
│  │     └─ ForgetPasswordForm.vue
│  ├─ main.ts
│  ├─ misc
│  │  └─ table
│  │     ├─ academicWork-import-header.ts
│  │     ├─ base-import-header.ts
│  │     ├─ cadre-import-headers.ts
│  │     ├─ competition-import-header.ts
│  │     ├─ employ-import-header.ts
│  │     ├─ foreign-import.header.ts
│  │     ├─ index.ts
│  │     ├─ leave-import-header.ts
│  │     ├─ poverty-import-header.ts
│  │     ├─ punishment-import-headers.ts
│  │     ├─ scholarship-import-header.ts
│  │     ├─ status-import-header.ts
│  │     └─ table-label-ch.ts
│  ├─ model
│  │  ├─ academicWorkModel.ts
│  │  ├─ cadreModel.ts
│  │  ├─ competitionModel.ts
│  │  ├─ employmentModel.ts
│  │  ├─ enrollmentModel.ts
│  │  ├─ foreignModel.ts
│  │  ├─ index.ts
│  │  ├─ leaveModel.ts
│  │  ├─ otherModel.ts
│  │  ├─ povertyModel.ts
│  │  ├─ punishmentModel.ts
│  │  ├─ scholarshipModel.ts
│  │  ├─ statusModel.ts
│  │  ├─ studentModel.ts
│  │  └─ systemModel.ts
│  ├─ router
│  │  ├─ academicWork.ts
│  │  ├─ base.ts
│  │  ├─ cadre.ts
│  │  ├─ competition.ts
│  │  ├─ employment.ts
│  │  ├─ foreign.ts
│  │  ├─ index.ts
│  │  ├─ leave.ts
│  │  ├─ poverty.ts
│  │  ├─ precaution.ts
│  │  ├─ punishment.ts
│  │  ├─ scholarship.ts
│  │  ├─ status.ts
│  │  └─ system.ts
│  ├─ stores
│  │  ├─ baseStore.ts
│  │  ├─ cadreStore.ts
│  │  ├─ competitionStore.ts
│  │  ├─ foreignStore.ts
│  │  ├─ leaveStore.ts
│  │  ├─ povertyStore.ts
│  │  ├─ scholarshipStore.ts
│  │  ├─ studentStore.ts
│  │  └─ userStore.ts
│  ├─ utils
│  │  └─ debounce.ts
│  └─ views
│     ├─ home
│     │  ├─ academicWork
│     │  │  ├─ AcademicWorkAudit.vue
│     │  │  ├─ AcademicWorkStat.vue
│     │  │  └─ AcademicWorkUpload.vue
│     │  ├─ base
│     │  │  ├─ BaseInfoImport.vue
│     │  │  ├─ BaseInfoTabs.vue
│     │  │  └─ tab
│     │  │     ├─ BaseInfoData.vue
│     │  │     ├─ BaseInfoStat.vue
│     │  │     ├─ data
│     │  │     │  ├─ BaseInfoTable.vue
│     │  │     │  └─ TableSelectMenu.vue
│     │  │     └─ stat
│     │  │        ├─ StatSelectMenu.vue
│     │  │        └─ StatTable.vue
│     │  ├─ cadre
│     │  │  ├─ CadreManage.vue
│     │  │  ├─ StudentCadreImpot.vue
│     │  │  ├─ StudentCadreTab.vue
│     │  │  └─ tab
│     │  │     ├─ StudentCadreData.vue
│     │  │     └─ StudentCadreStat.vue
│     │  ├─ competition
│     │  │  ├─ CompetitionAudit.vue
│     │  │  ├─ CompetitionManageTabs.vue
│     │  │  ├─ CompetitionUpload.vue
│     │  │  ├─ manage-tabs
│     │  │  │  ├─ CompetitionData.vue
│     │  │  │  └─ CompetitionImport.vue
│     │  │  └─ StudentCompetitionStat.vue
│     │  ├─ employment
│     │  │  ├─ EmploymentImport.vue
│     │  │  ├─ EmploymentTabs.vue
│     │  │  └─ select-tabs
│     │  │     ├─ EmploymentData.vue
│     │  │     └─ EmploymentStat.vue
│     │  ├─ foreign
│     │  │  ├─ ForeignLanguageImport.vue
│     │  │  ├─ ForeignLanguageTab.vue
│     │  │  ├─ LanguageManage.vue
│     │  │  └─ status-tab
│     │  │     ├─ ForeignLanguageData.vue
│     │  │     └─ ForeignLanguageStat.vue
│     │  ├─ leave
│     │  │  ├─ ApplyForLeave.vue
│     │  │  ├─ StudentLeaveAudit.vue
│     │  │  └─ StudentLeaveStat.vue
│     │  ├─ poverty
│     │  │  ├─ import-tabs
│     │  │  │  ├─ PovertyInfoImport.vue
│     │  │  │  └─ StudentPovertyImport.vue
│     │  │  ├─ PovertyImportTabs.vue
│     │  │  ├─ PovertyManage.vue
│     │  │  ├─ PovertyStatusTab.vue
│     │  │  └─ status-tabs
│     │  │     ├─ PovertyStatus.vue
│     │  │     └─ StudentPovertyList.vue
│     │  ├─ punishment
│     │  │  ├─ StudentPunishmentImport.vue
│     │  │  ├─ StudentPunishmentTab.vue
│     │  │  └─ tab
│     │  │     ├─ StudentPunishmentData.vue
│     │  │     └─ StudentPunishmentStat.vue
│     │  ├─ scholarship
│     │  │  ├─ ScholarManage.vue
│     │  │  ├─ StudentScholarshipImport.vue
│     │  │  ├─ StudentScholarshipTab.vue
│     │  │  └─ tab
│     │  │     ├─ StudentScholarshipData.vue
│     │  │     └─ StudentScholarshipStat.vue
│     │  ├─ status
│     │  │  ├─ StatusManage.vue
│     │  │  ├─ StudentStatusImport.vue
│     │  │  ├─ StudentStatusTab.vue
│     │  │  └─ tab
│     │  │     ├─ StudentStatusData.vue
│     │  │     └─ StudentStatusStat.vue
│     │  └─ system
│     │     ├─ RoleManage.vue
│     │     ├─ SchoolManageTab.vue
│     │     ├─ tabs
│     │     │  ├─ CounselorManage.vue
│     │     │  └─ MajorManage.vue
│     │     └─ UserManage.vue
│     ├─ HomeView.vue
│     └─ LoginView.vue
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ yarn.lock

```
