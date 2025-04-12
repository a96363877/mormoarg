interface PlateProps {
  violations: any
  setIsChecked: (isChecked: boolean) => void
  setAmount: (amount: any) => void
}

export default function Plate({ violations, setIsChecked, setAmount }: PlateProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, amount: number) => {
    setIsChecked(e.target.checked)
    setAmount((prevAmount: any) => (e.target.checked ? (prevAmount + amount) :( prevAmount - amount))
  )}

  return (
    <div
      className="col-sm-12 col-md-6 mt-2"
      style={{ color: 'white', background: 'red ' }}
    >
      {violations! && violations?.map((vio:any,index:number)=>
      <div key={index} className="accordion" id="accTicket000095049">
        {' '}
        <div className="card">
          {' '}
          <div
            className="card-header p-1"
            style={{
              background: '#eceae4 !important',
              borderTop: '5px solid green',
            }}
            id="hdr000095049"
          >
            {' '}
            <div className="row">
              {' '}
              <div className="col-2 align-self-center">
                <input type="checkbox" className="select-ticket"                     onChange={(e) => handleCheckboxChange(e, vio.violationAmount)}

                                   />
              </div>
              <div className="col-10">
                {' '}
                <div className="row m-0 p-0">
                  {' '}
                  <div
                    className="align-self-center m-2"
                    style={{ color: '#000576' }}
                  >
                    <b>رقم</b>:{ vio?.violationTicketNumber! ||1}
                  </div>{' '}
                </div>
              </div>
              <div
                className="col-12"
                style={{ borderTop: '2px solid #d6dce5' }}
              />{' '}
              <div className="col-12 m-0">
                {' '}
                <a
                  style={{ color: '#000576' }}
                  href="#"
                  data-target="#t000095049"
                  data-toggle="collapse"
                  aria-expanded="false"
                  aria-controls="#000095049"
                >
                  {' '}
                  <div className="row m-0 p-0">
                    {' '}
                    <div className="align-self-center m-2">
                      <b>قيمة المخالفات</b>:{vio?.violationAmount! && vio?.violationAmount! || 5} دك
                    </div>{' '}
                  </div>{' '}
                  <div className="row m-0 p-0">
                    {' '}
                    <div className="align-self-center m-2">
                      <b>رقم اللوحة</b>:{vio?.vehiclePlateNumber+'****' ! && vio?.vehiclePlateNumber!  || '*****'}
                    </div>{' '}
                  </div>{' '}
                  <div className="row m-0 p-0">
                    {' '}
                    <div className="align-self-center m-2">
                      <b>تاريخ المخالفة</b>:{vio?.violationDate.split("T")[0]}
                    </div>{' '}
                  </div>{' '}
                  <div className="row m-0 p-0">
                    <div className="col-12 text-left">
                      {' '}
                      <i className="fas fa-angle-down" />
                    </div>{' '}
                  </div>{' '}
                  <div className="row m-0 p-0">
                    <div className="col-12 text-left">
                      {' '}
                      <i className="fas fa-angle-down" />
                    </div>{' '}
                  </div>{' '}
                </a>
              </div>
            </div>{' '}
          </div>{' '}
          <div
            id="t000095049"
            className="collapse"
            aria-labelledby="hdr000095049"
            data-parent="#accTicket000095049"
          >
            {' '}
            <div className="card-body">
              <div className="spinner-grow" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>{' '}
          </div>{' '}
        </div>
      </div>
      )}
    </div>
  );
}
