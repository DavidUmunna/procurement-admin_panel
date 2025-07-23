import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  ClipboardCheck, 
  FileText, 
  BarChart2, 
  Timer 
} from "lucide-react";
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiMail, 
  FiCalendar, 
  FiInfo 
} from "react-icons/fi";
import { FaSitemap } from "react-icons/fa";
export const statusConfig = {
  approved: {
    color: "bg-green-100",
    icon: <CheckCircle className="text-green-600 w-5 h-5" />,
    title: "Approved Requests"
  },
  pending: {
    color: "bg-yellow-100",
    icon: <Clock className="text-yellow-500 w-5 h-5" />,
    title: "Pending Requests"
  },
  rejected: {
    color: "bg-red-100",
    icon: <XCircle className="text-red-500 w-5 h-5" />,
    title: "Rejected Requests"
  },
 
  completed: {
    color: "bg-blue-100",
    icon: <ClipboardCheck className="text-blue-600 w-5 h-5" />,
    title: "Completed Requests"
  }
};

export const summaryCardsConfig = [
  {
    icon: <FileText className="h-12 w-12 text-blue-600" />,
    title: "Total Requests",
    valueKey: "totalRequests",
    color: "text-blue-600"
  },
  {
    icon: <BarChart2 className="h-12 w-12 text-green-600" />,
    title: "Approval Rate",
    valueKey: "approvalRate",
    suffix: "%",
    color: "text-green-600"
  },
  {
    icon: <Timer className="h-12 w-12 text-purple-600" />,
    title: "Avg. Processing",
    valueKey: "avgProcessingTime",
    suffix: (value) => value === 1 ? "day" : "days",
    color: "text-purple-600"
  }
];