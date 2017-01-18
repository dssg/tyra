import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import FeatureImportanceChart from 'components/fimportance-chart/component'
import FeatureDistChart from 'components/featuredist-chart/component'
import MetricTimeChart from 'components/metrictime-chart/component'
import PRThresholdCurve from 'components/prthreshold-chart/component'
import PredictionsTable from 'components/predictions-table/component'
import RankCorrChart from 'components/rankcorr-chart/component'
import React from 'react'
import ScatterChart from 'components/scatter-chart/component'
import ScoreTimeModelChart from 'components/scoretimemodel-chart/component'


export default React.createClass({
  render: function() {
    return (
      <Tabs>
        <TabList>
          <Tab>Model Summary</Tab>
          <Tab>Individual Prediction</Tab>
          <Tab>Within-Model Comparison</Tab>
          <Tab>Between-Models Comparison</Tab>
        </TabList>

        <TabPanel>
          <PRThresholdCurve modelId={this.props.modelId}>
            <svg style={{ height:'700px', width: '500px' }}></svg>
          </PRThresholdCurve>
          <div className="col-lg-8">
            <ScatterChart className="with-3d-shadow with-transitions">
              <svg style={{ height: '500px', 'margin-left': 0 }} preserveAspectRatio="xMaxYMin"></svg>
            </ScatterChart>
          </div>
          <div className="col-lg-4">
            <div className="row">
              <PredictionsTable modelId={this.props.modelId} />
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <h3>Feature Distribution</h3>
          <FeatureDistChart>
            <svg style={{ height: '400px', width: '800px' }}></svg>
          </FeatureDistChart>
          <h3>Risk Score Cross Time and Models</h3>
          <ScoreTimeModelChart>
            <svg style={{ height: '400px', width: '600px' }}></svg>
          </ScoreTimeModelChart>
        </TabPanel>
        <TabPanel>
          <h3>Metrics Over Time</h3>
          <MetricTimeChart>
            <svg style={{ height: '400px', width: '800px', 'margin-left': 0 }}></svg>
          </MetricTimeChart>
          <h3>Feature Importance</h3>
          <FeatureImportanceChart>
            <svg style={{ height: '600px', width: '1000px' }}></svg>
          </FeatureImportanceChart>
        </TabPanel>
        <TabPanel>
          <h3>Rank Correlation</h3>
          <RankCorrChart>
          </RankCorrChart>
        </TabPanel>
      </Tabs>
    )
  }
})
