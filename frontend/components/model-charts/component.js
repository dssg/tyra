import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import FeatureImportanceChart from 'components/fimportance-chart/component'
import MetricTimeChart from 'components/metrictime-chart/component'
import PredictionsTable from 'components/predictions-table/component'
import SimplePrecisionRecallCurve from 'components/simplepr-chart/component'
import ThresholdPrecisionRecallCurve from 'components/thresholdpr-chart/component'
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
          <div className="col-md-5">
            <ThresholdPrecisionRecallCurve modelId={this.props.modelId}>
              <svg style={{ height:'700px', width: '500px' }}></svg>
            </ThresholdPrecisionRecallCurve>
          </div>
          <div className="col-md-2"></div>
          <div className="col-md-5">
            <SimplePrecisionRecallCurve modelId={this.props.modelId}>
              <svg style={{ height:'700px', width: '500px' }}></svg>
            </SimplePrecisionRecallCurve>
          </div>
          <div className="col-md-12">
            <h3>&nbsp;</h3>
          </div>
          <div className="col-md-7">
            <PredictionsTable modelId={this.props.modelId} />
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
