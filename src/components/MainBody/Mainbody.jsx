import React from 'react'
import './Mainbody.css'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IconButton } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
const Mainbody = () => {
  return (
    <div className="mainbody">
        <div className="mainbody_top">
            <div className="main_top_left">
                Current Form
            </div>
            <div className="main_top_right">
            <div className="main_top_center">Owned by anyone <ArrowDropDownIcon/></div>
                <IconButton>
                    <StorageIcon style={{fontSize:'20px',color:'black'}}/>
                </IconButton>
                <IconButton>
                    <FolderOpenIcon style={{fontSize:'20px',color:'black'}}/>
                </IconButton>
            </div>
        </div>
        <div className="mainbody_docs">
            <div className="doc_card">
                <img src="" alt="" className="doc_card_image" />
                <div className="doc_card_content"></div>
            </div>
        </div>

    </div>
  )
}

export default Mainbody