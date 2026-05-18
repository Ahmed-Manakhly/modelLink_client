/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {Container   } from 'react-bootstrap' 

//---------------------------------

function PageTable({data,columns , tableTitle}) {
    //-----------------------------------
    return (
        <Container  className={`PageTable g-5 p-md-3 gap-5  justify-content-center`}>
            <div className="container">
                <h2 className={"title"}>{tableTitle}</h2>
            </div>
            <Box m="40px" width="95%" sx={{
                backgroundColor:'#fff', padding : '20px',borderRadius: '15px',boxShadow: '5px 5px 10px var(--cultured)',
                "& .MuiDataGrid-root": {border: "none" , fontSize : '15px'},
                "& .name-column--cell": {color: '#5DB8DD' ,fontWeight :"bold"},
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: '#000', color: 'hsl(0, 0%, 47%)'},
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {color: `#eee !important`,}
                }}>
                <DataGrid rows={data} columns={columns} components={{ Toolbar: GridToolbar }} getRowId={row=>row.id} 
                    disableRowSelectionOnClick
                    checkboxSelection
                    initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10, 25,50]}
                    />
            </Box>
        </Container>
    )
}

export default PageTable ;



        
