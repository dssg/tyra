import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import BarChart from 'components/bar-chart/component'
import FeatureDistChart from 'components/featuredist-chart/component'
import MetricTimeChart from 'components/metrictime-chart/component'
import PredictionsTable from 'components/predictions-table/component'
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
          <div className="row"><h3>Feature Distribution</h3></div>
          <FeatureDistChart>
            <svg style={{ height: '400px', width: '800px' }}></svg>
          </FeatureDistChart>
          <div className="row"><h3>Risk Score Cross Time and Models</h3></div>
          <ScoreTimeModelChart>
            <svg style={{ height: '400px', width: '600px' }}></svg>
          </ScoreTimeModelChart>
        </TabPanel>
        <TabPanel>
          <div className="row"><h3>Metrics Over Time</h3></div>
          <MetricTimeChart>
            <svg style={{ height: '400px', width: '800px', 'margin-left': 0 }}></svg>
          </MetricTimeChart>
          <div className="row"><h3>Feature Importance</h3></div>
          <BarChart>
            <svg style={{ height: '400px', width: '800px' }}></svg>
          </BarChart>
        </TabPanel>
        <TabPanel>
          <p>content of between-model comparison</p>
        </TabPanel>
      </Tabs>
    )
  }
})
