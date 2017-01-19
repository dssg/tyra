import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import FeatureImportanceChart from 'components/fimportance-chart/component'
import MetricTimeChart from 'components/metrictime-chart/component'
import PredictionsTable from 'components/predictions-table/component'
import PRThresholdCurve from 'components/prthreshold-chart/component'
import React from 'react'

export default React.createClass({
  render: function() {
    return (
      <Tabs>
        <TabList>
          <Tab>Model Summary</Tab>
          <Tab>Within-Model Comparison</Tab>
        </TabList>

        <TabPanel>
          <div className="col-lg-8">
            <PRThresholdCurve modelId={this.props.modelId}>
              <svg style={{ height:'700px', width: '500px' }}></svg>
            </PRThresholdCurve>
          </div>
          <div className="col-lg-4">
            <div className="row">
              <PredictionsTable modelId={this.props.modelId} />
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="row"><h3>Metrics Over Time</h3></div>
          <MetricTimeChart>
            <svg style={{ height: '400px', width: '800px', 'margin-left': 0 }}></svg>
          </MetricTimeChart>
          <div className="row"><h3>Feature Importance</h3></div>
          <FeatureImportanceChart>
            <svg style={{ height: '400px', width: '800px' }}></svg>
          </FeatureImportanceChart>
        </TabPanel>
      </Tabs>
    )
  }
})
