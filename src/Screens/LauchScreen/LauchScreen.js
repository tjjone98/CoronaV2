import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import TableStatsCountry from './TableStatsCountry';
import fonts from '../../Themes/fonts';
import base from '../../Themes/base';
import colors from '../../Themes/colors';
import { observer, inject } from 'mobx-react';
import accounting from 'accounting';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import i18n from '../../Language/i18n';
import { Actions } from 'react-native-router-flux';
@inject('statsStore')
@observer
class LaunchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: [],
      textSearch: '',
      doubleBackToExitPressedOnce: false,
    };
  }
  async componentDidMount() {
    Actions.drawerClose();
    this.BackHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    await this.triggerUpdate();
  }

  /**
   * function support
   */
  backAction = () => {
    if (Actions.currentScene === 'launchScreen') {
      if (this.state.doubleBackToExitPressedOnce) {
        BackHandler.exitApp();
      } else {
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        this.setState({ doubleBackToExitPressedOnce: true });
        setTimeout(() => {
          this.setState({ doubleBackToExitPressedOnce: false });
        }, 2000);
      }
      return true;
    } else {
      return false;
    }
  };
  triggerUpdate = async () => {
    await this.fetchStatsGlobal();
    await this.fetchStatsTopCountry();
  };
  fetchStatsGlobal = async () => {
    await this.props.statsStore.getStatsGlobal();
  };
  fetchStatsTopCountry = async () => {
    this.props.statsStore.getStatsTopCountry().then(() => {
      this.setState({
        isLoading: false,
      });
    });
  };
  changeText = () => {
    let filterData = this.props.statsStore.statsTopCountry.filter((country) => {
      return String(country.country)
        .toLowerCase()
        .includes(this.state.textSearch.toLowerCase());
    });
    this.setState({
      data: filterData,
    });
  };

  /**
   * render view
   * @return {*}
   */
  render() {
    // init value
    let confirmed = accounting.formatNumber(
      this.props.statsStore.statsGlobal.totalConfirmed,
    );
    let deaths = accounting.formatNumber(
      this.props.statsStore.statsGlobal.totalDeaths,
    );
    let recovered = accounting.formatNumber(
      this.props.statsStore.statsGlobal.totalRecovered,
    );

    // render view
    return (
      <View style={styles.container}>
        <View style={styles.searchInput}>
          <TouchableOpacity
            onPress={() => {
              this.refs.textInput.focus();
            }}>
            <IconIonicons name="ios-search" size={24} color={colors.gray} />
          </TouchableOpacity>
          <TextInput
            ref="textInput"
            style={styles.input}
            placeholder={i18n.t('searchCountry')}
            onChangeText={(text) => {
              this.setState(
                {
                  textSearch: text,
                },
                () => {
                  this.changeText();
                },
              );
            }}
          />
        </View>
        {this.state.textSearch.length > 0 ? (
          <View style={{ flex: 0 }} />
        ) : (
          <View style={styles.statsGlobal}>
            <View style={styles.confirmCard}>
              <Text style={[styles.textNumber, [{ color: colors.red }]]}>
                {confirmed}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor: colors.red,
                    marginRight: 4,
                  }}
                />
                <Text>{i18n.t('confirmed')}</Text>
              </View>
            </View>
            <View style={styles.deathCard}>
              <Text style={[styles.textNumber, [{ color: colors.gray }]]}>
                {deaths}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor: colors.gray,
                    marginRight: 4,
                  }}
                />
                <Text>{i18n.t('deaths')}</Text>
              </View>
            </View>
            <View style={styles.recoveredCard}>
              <Text style={[styles.textNumber, [{ color: colors.green }]]}>
                {recovered}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor: colors.green,
                    marginRight: 4,
                  }}
                />
                <Text>{i18n.t('recovered')}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.statsTable}>
          <TableStatsCountry
            isLoading={this.state.isLoading}
            extraData={this.state.data}
            statsGlobalTopCountry={
              this.state.data.length > 0
                ? this.state.data
                : this.props.statsStore.statsTopCountry
            }
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  searchInput: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...base.border,
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  statsGlobal: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statsTable: {
    flex: 8,
  },
  confirmCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...base.border,
  },
  deathCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...base.border,
  },
  recoveredCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...base.border,
  },
  textNumber: {
    fontSize: fonts.lg,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
export default LaunchScreen;
