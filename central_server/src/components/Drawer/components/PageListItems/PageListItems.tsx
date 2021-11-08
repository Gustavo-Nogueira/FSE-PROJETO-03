import React from "react";

// React Router Dom
import { useHistory } from "react-router-dom";

// Material
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

// Material Design Icons
import Icon from "@mdi/react";
import { mdiHomeOutline } from "@mdi/js";
import { mdiClipboardCheckOutline } from "@mdi/js";
import { mdiClipboardRemoveOutline } from "@mdi/js";
import { mdiClipboardTextClockOutline } from "@mdi/js";

// Constants
import PATHS from "constants/paths";

interface PageListItemsProps {}

type Props = PageListItemsProps;

const PageListItems: React.FC<Props> = () => {
  const history = useHistory();

  return (
    <div>
      <ListItem button onClick={() => history.push(PATHS.HOME)}>
        <ListItemIcon>
          <Icon path={mdiHomeOutline} size={1.1} />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button onClick={() => history.push(PATHS.REGISTERED_DEVICES)}>
        <ListItemIcon>
          <Icon path={mdiClipboardCheckOutline} size={1.1} />
        </ListItemIcon>
        <ListItemText primary="Devices Cadastrados" />
      </ListItem>
      <ListItem button onClick={() => history.push(PATHS.UNREGISTERED_DEVICES)}>
        <ListItemIcon>
          <Icon path={mdiClipboardRemoveOutline} size={1.1} />
        </ListItemIcon>
        <ListItemText primary="Devices Não Cadastrados" />
      </ListItem>
      <ListItem button onClick={() => history.push(PATHS.LOGS)}>
        <ListItemIcon>
          <Icon path={mdiClipboardTextClockOutline} size={1.1} />
        </ListItemIcon>
        <ListItemText primary="Logs da Aplicação" />
      </ListItem>
    </div>
  );
};

export { PageListItems };
export default PageListItems;
