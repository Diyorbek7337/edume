const Table = ({ children, className = '' }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200">
    <table className={`w-full ${className}`}>
      {children}
    </table>
  </div>
);

const TableHead = ({ children, className = '' }) => (
  <thead className={`bg-gray-50 ${className}`}>
    {children}
  </thead>
);

const TableBody = ({ children, className = '' }) => (
  <tbody className={`divide-y divide-gray-100 ${className}`}>
    {children}
  </tbody>
);

const TableRow = ({ children, className = '', onClick, hover = true }) => (
  <tr 
    onClick={onClick}
    className={`
      ${hover ? 'hover:bg-gray-50' : ''}
      ${onClick ? 'cursor-pointer' : ''}
      transition-colors
      ${className}
    `}
  >
    {children}
  </tr>
);

const TableHeader = ({ children, className = '', align = 'left' }) => (
  <th 
    className={`
      px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider
      text-${align}
      ${className}
    `}
  >
    {children}
  </th>
);

const TableCell = ({ children, className = '', align = 'left' }) => (
  <td 
    className={`
      px-4 py-3 text-sm text-gray-700
      text-${align}
      ${className}
    `}
  >
    {children}
  </td>
);

const TableEmpty = ({ message = "Ma'lumot topilmadi", colSpan = 1 }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-12 text-center text-gray-500">
      <div className="flex flex-col items-center gap-2">
        <svg 
          className="w-12 h-12 text-gray-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
          />
        </svg>
        <p>{message}</p>
      </div>
    </td>
  </tr>
);

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Header = TableHeader;
Table.Cell = TableCell;
Table.Empty = TableEmpty;

export default Table;
