import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import IndividualTab from 'components/individual-tab/component'
import ModelInfo from 'components/model-info/component'
import RocCurve from 'components/roc-chart/component'
import React from 'react'
import SimplePrecisionRecallCurve from 'components/simplepr-chart/component'
import ThresholdPrecisionRecallCurve from 'components/thresholdpr-chart/component'
import WithinModelTab from 'components/withinmodel-tab/component'

export default React.createClass({
  render: function() {
    return (
      <Tabs>
        <TabList>
          <Tab>Model Summary</Tab>
          <Tab>Within-Model</Tab>
          <Tab>Individual</Tab>
        </TabList>
        <TabPanel>
          <ModelInfo modelId={this.props.modelId} asOfDate={this.props.asOfDate}></ModelInfo>
          <SimplePrecisionRecallCurve modelId={this.props.modelId} asOfDate={this.props.asOfDate}>
          </SimplePrecisionRecallCurve>
          <div className="col-md-6">
            <ThresholdPrecisionRecallCurve modelId={this.props.modelId} asOfDate={this.props.asOfDate}>
            </ThresholdPrecisionRecallCurve>
          </div>
          <div className="col-md-6">
            <RocCurve modelId={this.props.modelId} asOfDate={this.props.asOfDate}>
              <svg></svg>
            </RocCurve>
          </div>
        </TabPanel>
        <TabPanel>
          <ModelInfo modelId={this.props.modelId} asOfDate={this.props.asOfDate}></ModelInfo>
          <WithinModelTab modelId={this.props.modelId} metrics={this.props.metrics} asOfDate={this.props.asOfDate} />
        </TabPanel>
        <TabPanel>
          <ModelInfo modelId={this.props.modelId} asOfDate={this.props.asOfDate}></ModelInfo>
          <IndividualTab modelId={this.props.modelId} asOfDate={this.props.asOfDate}>
          </IndividualTab>
        </TabPanel>
      </Tabs>
    )
  }
})
