import React from 'react'

function SelectReceiverNone() {
    const containerStyle = {
        width: '244px',
        height: '180px',
        background: 'url("https://z-p3-static.xx.fbcdn.net/rsrc.php/v3/yC/r/vZNiC_HqLMo.png?_nc_eui2=AeGFsM6SoqJHpGPnudhDeDEpzLnNtCsK4CrMuc20KwrgKtuf7VszXLCAnjRgQidFY4qaFEQ1Edit3kGDBoDv4l6v")',
        backgroundPosition: '0px -182px',
        backgroundSize: '248px 494px',
        backgroundRepeat: 'no-repeat',
        display: 'inline-block',
      };

  return (
    <div className=" flex justify-center items-center flex-col  w-4/5 my-5 rounded-2xl bg-white  h-[calc(100vh]">
        <div className="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x6s0dn4 xsag5q8 xexx8yu">
            <i data-visualcompletion="css-img" style={containerStyle}></i>
        </div>
        <div className=' w-2/4  text-purple-500 mt-3 text-xl font-semibold text-center'>
            <p>No chat selected</p>
        </div>
        
    </div>
    )
}

export default SelectReceiverNone