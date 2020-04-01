import React from 'react';
import {Router, Scene, Drawer} from 'react-native-router-flux';
import DrawerComponent from '../Components/DrawerComponent';
import LaunchScreen from '../Screens/LauchScreen/LauchScreen';
import NewScreen from '../Screens/NewScreen/NewScreen';
import NewScreenDetail from '../Screens/NewScreen/NewScreenDetail';
import Icon from 'react-native-vector-icons/EvilIcons';
const Navigations = () => {
  return (
    <Router>
      <Drawer
        key="drawer"
        contentComponent={DrawerComponent}
        drawerIcon={() => {
          return <Icon name="navicon" size={25} />;
        }}>
        <Scene key="rootScene">
          <Scene
            key="launchScreen"
            component={LaunchScreen}
            initial
            title="Stats"
          />
          <Scene key="newScreen" component={NewScreen} title="News" />
          <Scene
            key="newDetail"
            component={NewScreenDetail}
            hideNavBar={true}
          />
        </Scene>
      </Drawer>
    </Router>
  );
};
export default Navigations;
