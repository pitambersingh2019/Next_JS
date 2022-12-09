interface IAddress {
  region: string;
  street: string;
  locality: string;
  postcode: string;
}

interface IBadge {
  id: string;
  name: string;
  badge: IImage;
}

interface IBarChart {
  change: number;
  yAxis: 'percent' | 'scale';
  data: IBarChartDatapoint[];
}

interface IBarChartBreakpoint {
  height: number;
  columns: number;
}

interface IBarChartDatapoint {
  date: Date;
  score: number;
}

interface IBranding {
  primaryColour?: string | null;
  logo?: IImage | null;
}

interface ICompanyValue {
  id: string;
  name: string;
  questionCount?: number;
}

interface IComponent {
  id: string;
  content: any;
}

interface IControl {
  text: string;
  metric?: string;
  method?: SortMethodType;
}

interface ICrop {
  width: number;
  height: number;
}

interface IDashboard {
  endpoint: string;
  host: string;
  company: string;
}

interface IFeedItem {
  id: string;
  sender: string;
  variant?: 'praise' | 'activity'; 
  avatar?: IImage;
  liker?: string;
  badge?: IImage;
  receiver?: string;
  message?: string;
  liked?: number[];
}

interface IField {
  name: string;
  opts?: string[];
  label: string;
  prompt?: string;
}

interface IFormIntro {
  formTitle?: string;
  formHeading: string;
  formSummary: string;
}

interface IGlobalData {
  social: ISocial;
  nav: INav;
  signupCta: ISignupCta;
}

interface IGlobalResponse {
  json: IGlobalData;
  status: number;
}

interface IImage {
  src: string;
  alt: string;
}

interface ILink {
  target: string;
  text: string;
}

interface IMetaSharing {
  opengraph: IMetaBase;
  twitter: IMetaBase;
}

interface IMetaBase {
  url?: string;
  title: string;
  description: string;
  image?: string;
}

interface IMeta extends IMetaBase {
  keywords: string;
  canonical: string;
  robots: string;
  sharing: IMetaSharing;
}

interface INav {
  header: ILink[];
  footer: ILink[];
}

interface INetwork {
  id: string;
  url: string;
}

interface IOption {
  text: string;
  value: string;
  disabled?: boolean;
}

interface IOptionCheckboxes extends IOption {
  choiceId?: string;
}

interface IPage {
  endpoint: string;
  host: string;
}

interface IPageContext {
  req: any;
  resolvedUrl: string;
  res: { statusCode: number; redirect: (path: string) => void } | undefined;
}

interface IPraise {
  id: number;
  badge: IImage;
  createDate: Date;
  from: string;
  message: string;
}

interface IPraiseMessage {
  message: string;
}

interface IOrder {
  name: null;
}

interface IQuery {
  device: 'mobile' | 'portrait' | 'landscape' | 'desktop';
  dimensions: IDimensions;
}

interface IQuestion {
  questionId: number;
  question: string;
  type: SurveyAnswerType;
  choices?: ISurveyChoice[];
  companyValueId?: string | null;
}

interface IRange {
  start: string;
  end: string;
}

interface IRanking {
  text: string;
  metric?: string;
}

interface IReporting extends IUserDetails, Record<string, string | null> {
  ageRange: string | null;
}

interface IRow {
  id?: string;
  type: string;
  content: any;
  link?: string;
  metric: string;
  createdByProsperEx?: boolean;
  status?: SurveyStatusType;
}

interface IScore {
  number: number;
  percent?: boolean;
}

interface ISignupCta {
  heading: string;
  content: string;
  button: ILink;
}

interface ISocial {
  networks: INetwork[];
  tags: ITags;
}

interface ISpace {
  id: string;
  name: string;
  branding: IBranding;
  user: IUser;
  locations: string[];
  teams: string[];
  roles: string[];
  seniority: string[];
  hasDiscounts: boolean;
}

interface ISuggestion {
  date: Date;
  employee: string;
  message: string;
  id: string;
}

interface ISummary {
  active: number;
  averageScore: number;
  responseRate: number;
  topics: ITopic[];
  trends: ITrend[];
  graph: IBarChart;
}

interface ISurveyBase {
  name: string;
  description: string;
  topicId?: string | null;
  questions: IQuestion[];
  isAnonymous?: boolean;
}

interface ISurvey extends ISurveyBase {
  id: number;
  status: SurveyStatusType;
  topicName?: string;
  start: boolean;
  recipients: number[];
  createdOn: Date;
  hasAnswered: boolean;
  createdByProsperEx: boolean;
}

interface ISurveyOption {
  choiceId?: number;
  text?: string;
  correct?: boolean;
  order: number;
}

interface ISurveyAnswer extends ISurveyOption {
  label?: Text;
  userAnswered?: boolean;
  totalAnswered?: number;
}

interface ISurveyChoice extends ISurveyOption {
  start?: string;
  end?: string;
}

interface ISurveyIndividual {
  score?: number;
  incorrectCount?: number;
  responses: ISurveyResponse[];
}

interface ISelectedSurvey {
  id: number;
  name?: string;
}

interface ISurveyListing {
  id: number;
  name: string;
  topic?: string;
  status: SurveyStatusType;
  averageScore?: number;
  responseRate: number;
  createdByProsperEx: boolean;
}

interface ISurveyListingOrder extends IOrder {
  topic?: null;
  averageScore?: null;
  mark?: null;
  responseRate?: null;
  status?: null;
}

interface ISurveyResponse {
  question: string;
  type: SurveyAnswerType;
  answers: ISurveyAnswer[];
  incorrect?: string[];
}

interface ISurveyResults {
  name: string;
  description: string;
  topicName?: string;
  averageScore?: number;
  responseRate?: number;
  recipientTotal: number;
  haveResponded: string[];
  notResponded: string[];
  recipientsAnswered: string;
  responses: ISurveyResponse[];
  isAnonymous?: boolean;
}

interface ITab {
  id: string;
  topic: string;
}

interface ITags {
  hash: string;
  at: string;
}

interface ITopic {
  id: string;
  name: string;
  active: number;
  ended: number;
}

interface ITopicUpdate {
  name: string;
}

interface ITrend {
  topicId: string;
  topicName: string;
  change: number;
  averageScore: number;
}

interface IUserBase extends IUserDetails {
  name: string;
  department: string | null;
  roles: string[] | null;
}

interface IUserDetails {
  location: string | null;
  team: string | null;
  jobRole: string | null;
  gender: string | null;
  seniority: string | null;
  employeeStartDate: string | null;
}

interface IUser extends IUserBase {
  id: number;
  firstName: string;
  avatar: IImage | null;
  initials: string;
  notifications: number;
  isActive: boolean;
}

interface IUserIndex extends IUserBase, Record<string, string | string[] | null> {
  dateOfBirth: string | null;
  email: string;
}

interface IUserResend {
  id: number;
  name: string;
}

type IconType = 'dashboard' | 'learning' | 'discount' | 'voice' | 'praise' | 'feedback' | 'happiness' | 'survey' | 'team' | 'whitepaper' | 'culture';

type SortMethodType = 'date' | 'order';

type SurveyAnswerType = 1 | 2 | 3 | 4 | 5 | 6;

type SurveyStatusType = 'Active' | 'Draft' | 'Ended';

type SurveyType = 'Culture' | 'Happiness' | 'Surveys' | 'Learning';
