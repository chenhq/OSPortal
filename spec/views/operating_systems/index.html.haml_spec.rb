require 'spec_helper'

describe "operating_systems/index" do
  before(:each) do
    assign(:operating_systems, [
      stub_model(OperatingSystem,
        :name => "Name",
        :os_type_id => 1,
        :cpuarc => "Cpuarc",
        :cpubit => 2,
        :desc => "Desc"
      ),
      stub_model(OperatingSystem,
        :name => "Name",
        :os_type_id => 1,
        :cpuarc => "Cpuarc",
        :cpubit => 2,
        :desc => "Desc"
      )
    ])
  end

  it "renders a list of operating_systems" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => 1.to_s, :count => 2
    assert_select "tr>td", :text => "Cpuarc".to_s, :count => 2
    assert_select "tr>td", :text => 2.to_s, :count => 2
    assert_select "tr>td", :text => "Desc".to_s, :count => 2
  end
end
