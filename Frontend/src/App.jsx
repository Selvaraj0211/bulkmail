import { useState } from 'react'
import * as XLSX from 'xlsx'
import { FaFileUpload } from "react-icons/fa";
import axios from 'axios'
import './App.css'

function App() {

  const [subjet, setsubjet] = useState("");
  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emillists, setemaillist] = useState([])

  function handlesubjet(e) {
    setsubjet(e.target.value);
    setmsg(e.target.value)
  }
  function handlemessage(e) {
    setmsg(e.target.value)
  }

  function failupload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalemail = emaillist.map(function (item) { return item.A });
      console.log(totalemail)
      setemaillist(totalemail);

    }
    reader.readAsBinaryString(file);

  }

  const send = async (e) => {
    e.preventDefault();
    setstatus(true)

    const response = await axios.post("https://bulkmail-ysvd.onrender.com/sendmail", { msg: msg, sub: subjet, emaillist: emillists })
      .then((data) => {
        if (data.data === true) {
          alert("Email send successfully")
          setstatus(false)
        } else {
          alert("Failed")
        }

      })


  }

  return (
    < >
      <header className="bg-gradient-to-r from-blue-500 to-pink-600 shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-extrabold text-white">BulkMail</h1>
          <p className="text-indigo-100 mt-2 text-lg">Efficient mass email platform tailored for professionals</p>
        </div>
      </header>
      <div className="w-full bg-gray-100 py-10">

        <div className="max-w-5xl mx-auto px-4">
          {/* Subject Input */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl mb-6">
            <div className="px-8 py-5">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Subject</h2>
              <input
                onChange={handlesubjet}
                className="w-full h-6 p-5 border border-gray-300 rounded-xl bg-gray-50 text-gray-800"
                placeholder="Write your email subject here..."
              />
            </div>

            {/* Email Body */}
            <div className="px-8 pb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Compose Email</h2>
              <textarea
                onChange={handlemessage}
                className="w-full h-64 p-5 border border-gray-300 rounded-xl resize-none bg-gray-50 text-gray-800"
                placeholder="Write your email message here..."
              ></textarea>
            </div>
          </div>


          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Recipient List</h2>
            <div className="border-2 border-dashed rounded-xl p-10 text-center">
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <FaFileUpload className="w-16 h-16 text-blue-500 mb-4" />
                <p className="text-gray-700 text-lg mb-2">
                  <span className="font-semibold text-indigo-600 hover:underline">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-500">Excel files only (.xlsx, .xls)</p>
              </label>


              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={failupload}
                className="hidden"
              />
            </div>

            <div className="mt-6 flex justify-between items-center">
              <p className="text-gray-600 text-lg">
                <span className="font-semibold text-indigo-600">{emillists.length}</span> valid email addresses detected
              </p>
              <button
                onClick={send}
                className="px-8 py-3 rounded-xl font-semibold text-white bg-blue-700">
                {status ? "sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default App
