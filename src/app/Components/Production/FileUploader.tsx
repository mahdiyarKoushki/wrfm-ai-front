"use client"
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'

interface stateProps {
  jsonExel?: {}
  setjsonExel: Dispatch<SetStateAction<{}>>
}

export const FileUploader: React.FC<stateProps> = ({
  jsonExel,
  setjsonExel,
}) => {
  const [fileName, setFileName] = useState<string>('')


  const excelDateToJSDate = (serial: number): string => {
    const utc_days = Math.floor(serial - 25569)
    const utc_value = utc_days * 86400
    const date_info = new Date(utc_value * 1000)
    return date_info.toISOString().split('T')[0]
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
 
      setFileName(file.name)
    

      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result
        if (typeof binaryStr !== 'string') return

        if (
          file.type.includes('sheet') ||
          file.name.toLowerCase().endsWith('.xlsx')
        ) {
          const workBook = XLSX.read(binaryStr, { type: 'binary' })
          const jsonResult: { [key: string]: any[] } = {}

          workBook.SheetNames.forEach((sheetName) => {
            let jsonData: any[] = XLSX.utils.sheet_to_json(
              workBook.Sheets[sheetName]
            )
            jsonData = jsonData.map((row) => {
              if (typeof row.Date === 'number') {
                row.Date = excelDateToJSDate(row.Date)
              }
              return row
            })
            jsonResult[sheetName] = jsonData
          })

          setjsonExel(jsonResult)
        } else if (
          file.type.includes('csv') ||
          file.name.toLowerCase().endsWith('.csv')
        ) {
          Papa.parse(binaryStr, {
            complete: (result) => {
              setjsonExel({ 'CSV Data': result.data })
            },
            header: true,
          })
        }
      }

      if (
        file.type.includes('sheet') ||
        file.name.toLowerCase().endsWith('.xlsx')
      ) {
        reader.readAsBinaryString(file)
      } else {
        reader.readAsText(file)
      }
    },
    [setjsonExel]
  )

  // take out the inputProps so we can override onChange
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'text/csv': ['.csv'],
    },
    maxSize: 10 * 1024 * 1024, // 10 MB
  })
  const inputProps = getInputProps()
  // override onChange to clear value after selection
  const { onChange, ...restInputProps } = inputProps

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e)        // اول dropzone رو صدا می‌زنه
    e.target.value = ''            // بعد ورودی رو خالی می‌کنه
  }

  return (
    <>
      <div {...getRootProps()} className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="pt-5 pb-6 text-center">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p>
              Drag & drop here or{' '}
              <span className="text-blue-600">choose a file</span>
            </p>
          </div>
          <input
            {...restInputProps}
            onChange={handleInputChange}
            className="hidden"
            type="file"
          />
        </label>
      </div>

      {/* اینجا به‌جای supported format، اسم فایل را نمایش می‌دهیم */}
      <div className="mt-2 text-sm text-gray-600">
        {fileName
          ? `Last uploaded file: ${fileName}`
          : 'No file uploaded yet.'}
      </div>
    </>
  )
}