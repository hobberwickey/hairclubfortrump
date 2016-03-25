class Tag < ActiveRecord::Base
	has_many :tagged_items
  has_many :images, :through => :tagged_items

  def self.with_thumbs
    result = []
    self.where({:name => "All"}).each do |t|
      result << { 
        :id => t.id, 
        :name => t.name, 
        :plural => t.name.pluralize, 
        :thumb => t.images.first.file(:thumb),
        :count => t.images.count
      }
    end

    result
  end
end
