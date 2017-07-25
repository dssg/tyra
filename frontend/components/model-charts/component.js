import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import FeatureBlock from 'components/feature-block/component'
import MetricTimeChart from 'components/metrictime-chart/component'
import ModelInfo from 'components/model-info/component'
import PredictionsTable from 'components/predictions-table/component'
import RocCurve from 'components/roc-chart/component'
import React from 'react'
import SimplePrecisionRecallCurve from 'components/simplepr-chart/component'
import ThresholdPrecisionRecallCurve from 'components/thresholdpr-chart/component'

export default React.createClass({
  render: function() {
    return (
      <Tabs>
        <TabList>
          <Tab>Model Summary</Tab>
          <Tab>Within-Model Comparison</Tab>
        </TabList>
        <TabPanel>
          <ModelInfo modelId={this.props.modelId} asOfDate={this.props.asOfDate}></ModelInfo>
          <div className="col-md-6">
            <ThresholdPrecisionRecallCurve modelId={this.props.modelId} asOfDate={this.props.asOfDate}>
            </ThresholdPrecisionRecallCurve>
          </div>
          <div className="col-md-6">
            <SimplePrecisionRecallCurve modelId={this.props.modelId} asOfDate={this.props.asOfDate}>
            </SimplePrecisionRecallCurve>
          </div>
          <div className="col-md-6">
            <RocCurve modelId={this.props.modelId} asOfDate={this.props.asOfDate}>
              <svg></svg>
            </RocCurve>
          </div>
          <div className="col-md-2"></div>
          <div className="col-md-4">
            <PredictionsTable modelId={this.props.modelId} asOfDate={this.props.asOfDate} />
          </div>
        </TabPanel>
        <TabPanel>
          <ModelInfo modelId={this.props.modelId} asOfDate={this.props.asOfDate}></ModelInfo>
          <MetricTimeChart modelId={this.props.modelId} metrics={this.props.metrics}>
            <svg style={{ height: '400px', width: '800px', 'margin-left': 0 }}></svg>
          </MetricTimeChart>
          <FeatureBlock modelId={this.props.modelId} />
        </TabPanel>
      </Tabs>
    )
  }
})
