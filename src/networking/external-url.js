// const server_url = "https://backend.reatentapp.com"; // Production
// const server_url = "https://reatent-backend.herokuapp.com"; // Test
const server_url = "http://localhost:8034"; // Local
const server_port = ""
const api_path = "/api";


export const websocket_url = "http://localhost:8034/ws-notifications/"; // Local
// const websocket_url = "https://backend.reatentapp.com/ws-notifications/"; // Production

// Websocket Routes...
export const adminGroupTopicUrl = api_path + "/notification/admin-group";
export const lecturerGroupTopicUrl = api_path + "/notification/lecturer-group";
export const studentGroupTopicUrl = api_path + "/notification/student-group";


// User Routes...
export const getUserDetailsUrl = server_url + server_port + api_path + "/user/get-current-user-details";
export const createAdminUrl = server_url + server_port + api_path + "/user/create-new-admin";
export const createUserUrl = server_url + server_port + api_path + "/user/create-new";
export const loginUrl = server_url + server_port + api_path + "/user/login";
export const forgotPasswordUrl = server_url + server_port + api_path + "/user/forgot-password";
export const resetPasswordUrl = server_url + server_port + api_path + "/user/custom-password-reset";
export const getAllLecturersUrl = server_url + server_port + api_path + "/user/get-all-lecturers";
export const getAllStudentsUrl = server_url + server_port + api_path + "/user/get-all-students";
export const editProfileUrl = server_url + server_port + api_path + "/user/edit-profile";


// Quote Routes..
export const getStartedUrl = server_url + server_port + api_path + "/quote/get";
export const viewAllQuotesUrl = server_url + server_port + api_path + "/quote/view/all";
export const getAllTitlesUrl = server_url + server_port + api_path + "/quote/get/titles";


// Country Routes...
export const getCountriesUrl = server_url + server_port + api_path + "/country/get/all";
export const getAllStatesUrl = server_url + server_port + api_path + "/country/get/states/all/";
export const getAllCitiesUrl = server_url + server_port + api_path + "/country/get/cities/all/";


// Category Routes
export const addCategoryUrl = server_url + server_port + api_path + "/category/add";
export const getAllCategoriesUrl = server_url + server_port + api_path + "/category/filter";


// School Routes...
export const getAllSchoolsUrl = server_url + server_port + api_path + "/school/get/all";
export const createSchoolUrl = server_url + server_port + api_path + "/school/create";
export const getClassNamesUrl = server_url + server_port + api_path + "/school/class-name/get";
export const createClassNameUrl = server_url + server_port + api_path + "/school/create-class-name";
export const getClassesUrl = server_url + server_port + api_path + "/school/classes/get/all/";
export const createClassUrl = server_url + server_port + api_path + "/school/create-class";
export const getSchoolUrl = server_url + server_port + api_path + "/school/get/";


// Media Routes...
/** Media assessment **/
export const getAssessmentFileNameUrl = server_url + server_port + api_path + "/file/assessment/get-name/";
export const downloadAssessmentUrl = server_url + server_port + api_path + "/file/assessment/download/";
export const getMediaFileSizeUrl = server_url + server_port + api_path + "/file/media/get-size/";
export const getAssessmentSolutionFileNameUrl = server_url + server_port + api_path + "/file/assessment-solution/get-name/";
export const downloadAssessmentSolutionUrl = server_url + server_port + api_path + "/file/assessment-solution/download/";
/** Media misc **/
export const addMediaUrl = server_url + server_port + api_path + "/media/add";
export const uploadMediaUrl = server_url + server_port + api_path + "/media/upload";
export const deleteMediaUrl = server_url + server_port + api_path + "/media/upload/remove/";
export const getAllMediaByClassUrl = server_url + server_port + api_path + "/media/get/all/";
export const getAllMediaUrl = server_url + server_port + api_path + "/media/get/all";
export const getMediaUrl = server_url + server_port + api_path + "/media/get-single/";
export const getAllMediaFilesByCategoryIdUrl = server_url + server_port + api_path + "/media/student/get/all/";
export const getTotalMediaCountByCategoryIdUrl = server_url + server_port + api_path + "/media/get-count/";
/** Media submissions **/
export const getAllSubmissionsUrl = server_url + server_port + api_path + "/media/submissions/get";
export const getAllSubissionAssessmentsUrl = server_url + server_port + api_path + "/media/submissions/assessments/all/";
export const getSubmissionUrl = server_url + server_port + api_path + "/media/submission/get/";
export const uploadAssessmentSolutionUrl = server_url + server_port + api_path + "/media/submit-assessment/";
export const toggleAssessmentSubmissionUrl = server_url + server_port + api_path + "/media/submissions/toggle/";
export const gradeStudentUrl = server_url + server_port + api_path + "/media/submissions/grade-student";
export const getStudentSubmission = server_url + server_port + api_path + "/media/student-submission/get/";


// Todo List Routes
export const createTodoListItemUrl = server_url + server_port + api_path + "/todo/create-item";
export const getAllTodoListItemsUrl = server_url + server_port + api_path + "/todo/get/all/";
export const getAllTodoListItemsCountUrl = server_url + server_port + api_path + "/todo/get/all-count/";
export const completeTodoListItemUrl = server_url + server_port + api_path + "/todo/complete/";
export const deleteTodoListItemUrl = server_url + server_port + api_path + "/todo/delete/";


// Student View Routes
export const getTotalViewsCountByMediaIdUrl = server_url + server_port + api_path + "/student-view/all/count/";
export const getStudentViewsUrl = server_url + server_port + api_path + "/student-view/all";


// Comment Routes
export const getTotalCommentsCountByMediaIdUrl = server_url + server_port + api_path + "/comment/get/all-count/";
export const getCommentsByMediaIdUrl = server_url + server_port + api_path + "/comment/get/all/";
export const getCommentReplyByCommentIdUrl = server_url + server_port + api_path + "/comment/get-reply/";
export const addCommentReplyUrl = server_url + server_port + api_path + "/comment/add-reply";
export const addCommentUrl = server_url + server_port + api_path + "/comment/add";
export const getTotalCommentsCountByCategoryIdUrl = server_url + server_port + api_path + "/comment/get/all-count-by-category/";


// Search Routes
export const getSearchCountForStudent = server_url + server_port + api_path + "/search/get-count-for-student/";
export const getSearchCountForLecturer = server_url + server_port + api_path + "/search/get-count-for-lecturer/";



// Notification Routes
export const getNotificationsUrl = server_url + server_port + api_path + "/notification/get/all/";
export const deleteNotificationUrl = server_url + server_port + api_path + "/notification/delete/";
export const clearAllNotificationsUrl = server_url + server_port + api_path + "/notification/clear-all/";