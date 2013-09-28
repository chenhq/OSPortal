class OperatingSystem < ActiveRecord::Base
  attr_accessible :cpuarc, :cpubit, :desc, :name, :os_type_id, :image_id
  belongs_to :os_type
  belongs_to :image
end
