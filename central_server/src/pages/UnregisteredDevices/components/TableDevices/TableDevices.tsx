import React from "react";

// Redux
import { useSelector } from "react-redux";

// Material
import { styled } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell, { tableCellClasses } from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";

// Material Design Icons
import Icon from "@mdi/react";
import { mdiPlusCircleOutline } from "@mdi/js";

// Components
import RegistrationForm from "../RegistrationForm";

// Constants
import DEVICE_CONSTANTS from "constants/devices";

// Types
import { ApplicationState } from "store";
import { UnregisteredDeviceInterface } from "store/devices/types";

// Styles
import useStyles from "./tableDevices.styles";

const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }: any) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface TableDevicesProps {}

type Props = TableDevicesProps;

const TableDevices: React.FC<Props> = () => {
  const classes = useStyles();

  const unregisteredDevicesList = useSelector(
    (state: ApplicationState) => state.devices.unregisteredDevicesList
  );

  const [openForm, setOpenForm] = React.useState(false);
  const [deviceSelected, setDeviceSelected] =
    React.useState<UnregisteredDeviceInterface | null>(null);

  const handleOpenForm = (data: UnregisteredDeviceInterface) => {
    setOpenForm(true);
    setDeviceSelected(data);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <>
      <RegistrationForm
        open={openForm}
        handleClose={handleCloseForm}
        deviceData={deviceSelected}
      />
      <Grid
        container
        spacing={2}
        justifyContent="center"
        className={classes.root}
      >
        <Grid item xs={10}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Device ID</StyledTableCell>
                  <StyledTableCell align="center">Modo</StyledTableCell>
                  <StyledTableCell align="center">
                    Última atualização
                  </StyledTableCell>
                  <StyledTableCell align="center" />
                </TableRow>
              </TableHead>
              <TableBody>
                {unregisteredDevicesList.map((device) => (
                  <StyledTableRow key={device.id}>
                    <StyledTableCell component="th" scope="row">
                      {device.id}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {
                        DEVICE_CONSTANTS.DEVICE_MODES.find(
                          (MODE) => MODE.KEY === device.mode
                        )?.VALE
                      }
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {device.updatedAt}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <IconButton
                        title="Cadastrar Device"
                        onClick={() => handleOpenForm(device)}
                      >
                        <Icon path={mdiPlusCircleOutline} size={1} />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export { TableDevices };
export default TableDevices;
