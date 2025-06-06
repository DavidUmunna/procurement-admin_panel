import React,{useState} from "react"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { FiCalendar, FiX, FiDownload } from "react-icons/fi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExcelExport=({setopenmodal,setLoading})=>{
    const [formData,setFormData]=useState({
        startDate:new Date(new Date().setDate(1)),
        endDate:new Date(),
        status:'',
        filename:"log_report"
    })

    const [validationErrors, setValidationErrors] = useState({});
    const [downloadProgress, setDownloadProgress] = useState(0);
    
    const handleDateRangeChange=(dates)=>{
        const [start,end]=dates;
        setFormData((prev)=>({
            ...prev,
            startDate:start,
            endDate:end
        }))
    }


    const resetForm=()=>{
        setFormData({
            startDate:new Date(new Date().setDate(1)),
          endDate:new Date(),
          status:'',
          filename:"log_report"
        })
        setValidationErrors({})
    }

    

    return(
        <>
        </>
    )
}

export default ExcelExport